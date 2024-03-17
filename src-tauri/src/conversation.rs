use regex::Regex;
use serde::de::{self, Visitor};
use serde::{Deserialize, Deserializer, Serialize, Serializer};
use serde_json::json;
use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;
use std::{fmt, fs};
use surrealdb::sql::{Id, Thing};
use tauri::AppHandle;

use crate::db::DB;

#[derive(Serialize, Deserialize, Debug)]
pub struct Conversation {
    id: Option<Thing>,
    messages: Vec<Message>,
    title: Option<String>,
    last_modified: Option<usize>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Message {
    role: String,
    content: String,
}

#[tauri::command]
pub async fn save_conversation(conversation: Conversation) -> Result<Conversation, String> {
    let conversation: Conversation = match conversation.id.clone() {
        None => DB
            .create("conversations")
            .content(conversation)
            .await
            .map_err(|e| format!("{}", e))?
            .pop()
            .unwrap(),
        Some(id) => DB
            .update(("conversations", id.id.to_raw()))
            .content(conversation)
            .await
            .map_err(|e| format!("{}", e))?
            .unwrap(),
    };

    Ok(conversation)
}

#[tauri::command]
pub async fn delete_conversation(conversation_id: &str) -> Result<(), String> {
    let _ = DB
        .delete::<Option<Conversation>>(("conversations", conversation_id))
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn load_conversation<P: AsRef<Path>>(path: P) -> Result<Conversation, String> {
    let mut json = String::new();
    let mut file = File::open(path).map_err(|e| e.to_string())?;
    file.read_to_string(&mut json).map_err(|e| e.to_string())?;

    let conversation = serde_json::from_str(&json)
        .map_err(|e| format!("could not serialize conversation: {}", e))?;

    Ok(conversation)
}

#[tauri::command]
pub async fn get_conversation(conversation_id: &str) -> Result<Conversation, String> {
    let conversation: Option<Conversation> = DB
        .select(("conversations", conversation_id))
        .await
        .map_err(|e| format!("{}", e))?;

    Ok(conversation.ok_or("conversation not found".to_string())?)
}

#[tauri::command]
pub async fn get_conversations() -> Result<Vec<Conversation>, String> {
    let conversations: Vec<Conversation> = DB
        .select("conversations")
        .await
        .map_err(|e| format!("{}", e))?;

    Ok(conversations)
}

#[tauri::command]
pub async fn search_conversation(
    app: AppHandle,
    conversation_id: &str,
    search: String,
) -> Result<Conversation, String> {
    let mut conversation = get_conversation(conversation_id).await?;

    let regex =
        Regex::new(format!("({})", search).as_str()).map_err(|_| "Invalid Regex".to_string())?;

    conversation.messages.iter_mut().for_each(|message| {
        regex.replace_all(message.content.as_str(), "");
    });

    return Ok(conversation);
}
