use serde::{Deserialize, Serialize};
use serde_json::json;
use std::fs::File;
use std::io::{Write, Read};

#[derive(Serialize, Deserialize, Debug)]
pub struct Conversation {
    id: String,
    messages: Vec<Message>,
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

    let file = File::open(path).map_err(|e| e.to_string())?;
    
    let conversation: Conversation = serde_json::from_reader(file).map_err(|e| e.to_string())?;

    Ok(conversation)
}
