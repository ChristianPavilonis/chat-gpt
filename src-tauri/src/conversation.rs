use regex::Regex;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::fs::{self, remove_file};
use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;
use tauri::AppHandle;

#[derive(Serialize, Deserialize, Debug)]
pub struct Conversation {
    id: String,
    messages: Vec<Message>,
    title: Option<String>,
    last_modified: Option<usize>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Message {
    role: String,
    content: String,
}

fn conversation_path(app: AppHandle, conversation_id: &String) -> Option<String> {
    let mut path = match app.path_resolver().app_data_dir() {
        Some(path) => path.to_string_lossy().to_string(),
        None => {
            return None;
        }
    };

    Some(format!("{path}/{}", conversation_id))
}

#[tauri::command]
pub fn save_conversation(app: AppHandle, conversation: Conversation) -> Result<(), String> {
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

#[tauri::command]
pub fn delete_conversation(app: AppHandle, conversation_id: String) -> Result<(), String> {
    let path = match conversation_path(app, &conversation_id) {
        Some(path) => path,
        None => {
            return Err(format!(
                "Could not resolve path for conversation {}",
                conversation_id
            ))
        }
    };

    remove_file(path).map_err(|e| format!("could not delete file: {}", e))?;

    Ok(())
}

pub fn load_conversation<P: AsRef<Path>>(path: P) -> Result<Conversation, String> {
    let mut json = String::new();
    let mut file = File::open(path).map_err(|e| format!("could not open file {}", e))?;
    file.read_to_string(&mut json)
        .map_err(|e| format!("could not read file {}", e))?;

    let conversation = serde_json::from_str(&json)
        .map_err(|e| format!("could not serialize conversation: {}", e))?;

    Ok(conversation)
}

#[tauri::command]
pub fn get_conversation(app: AppHandle, conversation_id: String) -> Result<Conversation, String> {
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
pub fn get_conversations(app: AppHandle) -> Result<Vec<Conversation>, String> {
    let path = match conversation_path(app, &"".to_string()) {
        Some(path) => path,
        None => {
            return Err(format!("Could not resolve path for conversations"));
        }
    };

    let dir = fs::read_dir(path).map_err(|e| format!("could not read all files {e}"))?;

    let mut conversations = dir
        .into_iter()
        .flatten()
        .flat_map(|file| {
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
                    println!("error loading conversation {}", e);
                    None
                }
            }
        })
        .collect::<Vec<Conversation>>();

    conversations.sort_by_key(|c| c.last_modified.unwrap_or(0) as isize * -1);

    Ok(conversations)
}

#[tauri::command]
pub fn search_conversation(
    app: AppHandle,
    conversation_id: String,
    search: String,
) -> Result<Conversation, String> {
    let mut conversation = get_conversation(app, conversation_id)?;

    let regex =
        Regex::new(format!("({})", search).as_str()).map_err(|_| "Invalid Regex".to_string())?;

    conversation.messages.iter_mut().for_each(|message| {
        regex.replace_all(message.content.as_str(), "");
    });

    return Ok(conversation);
}
