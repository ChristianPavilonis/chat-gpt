use serde::{Deserialize, Serialize};
use serde_json::json;
use std::fs::File;
use std::fs;
use std::io::{Write, Read};
use std::path::Path;

#[derive(Serialize, Deserialize, Debug)]
pub struct Conversation {
    id: String,
    messages: Vec<Message>,
    title: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Message {
    role: String,
    content: String,
}

fn conversation_path(app: tauri::AppHandle, conversation_id: &String) -> Option<String> {
    let mut path = match app.path_resolver().app_data_dir() {
        Some(path) => path.to_string_lossy().to_string(),
        None => {
            return None;
        }
    };

    Some(format!("{path}/{}", conversation_id))
}


#[tauri::command]
pub fn save_conversation(app: tauri::AppHandle, conversation: Conversation) -> Result<(), String> {
    let path = match conversation_path(app, &conversation.id) {
        Some(path) => path,
        None => {
            return Err(format!(
                "Could not resolve path for conversation {}",
                conversation.id
            ))
        }
    };

    let mut file = File::create(path).map_err(|e| e.to_string())?;

    write!(file, "{}", json!(conversation)).map_err(|e| e.to_string())?;

    Ok(())
}

pub fn load_conversation<P: AsRef<Path>>(path: P) -> Result<Conversation, String> {
    let mut json = String::new();
    let mut file = File::open(path).map_err(|e| e.to_string())?;
    file.read_to_string(&mut json).map_err(|e| e.to_string())?;


    let conversation = serde_json::from_str(&json).map_err(|e| format!("serde: {}", e))?;

    Ok(conversation)
}

#[tauri::command]
pub fn get_conversation(
    app: tauri::AppHandle,
    conversation_id: String,
) -> Result<Conversation, String> {
    let path = match conversation_path(app, &conversation_id) {
        Some(path) => path,
        None => {
            return Err(format!(
                "Could not resolve path for conversation {}",
                conversation_id
            ));
        }
    };

    let conversation = load_conversation(path)?;

    Ok(conversation)
}


#[tauri::command]
pub fn get_conversations(app: tauri::AppHandle) -> Result<Vec<Conversation>, String> {

    let path = match conversation_path(app, &"".to_string()) {
        Some(path) => path,
        None => {
            return Err(format!("Could not resolve path for conversations"));
        }
    };


    let dir = fs::read_dir(path).map_err(|e| format!("{e}"))?;

    let conversations = dir.into_iter().flatten().flat_map(|file| {
        let file_path = file.path();

        let should_skip = match file_path.to_str() {
            Some(p) => p.contains(".settings"),
            None => false,
        };

        if should_skip {
            return None;
        }

        match load_conversation(file_path) {
            Ok(convo) => Some(convo),
            Err(e) => {
                println!("{:?}", e);
                None
            }
        }
    }).collect();


    Ok(conversations)
}