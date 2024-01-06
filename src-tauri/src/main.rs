// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::env;
use std::fs;
use serde_json::json;
use std::io::Error;
use std::path::Path;
use crate::errors::CommandResult;
mod errors;
use tauri::Manager;

#[tauri::command]
fn set_json(data: &str) -> CommandResult<String> {
  println!(" - : COMMAND : - SETJSON");
  let _json_data: serde_json::Value = json!(data);

  let path: &Path = Path::new("../src/assets/json/datas.json");
  if path.exists() == true {
    let _result: Result<(), Error> = fs::write(path, data);
    Ok("true".to_owned())
  } else {
   Ok("false".to_owned())
  }
}

#[tauri::command]
fn get_json() -> CommandResult<String> {
  println!(" - : COMMAND : - GETJSON");
  let path: &Path = Path::new("../src/assets/json/datas.json");
  if path.exists() == true  {
    let content: Result<String, std::io::Error> = fs::read_to_string(path);
    let unwrap_content: String = content.unwrap_or("2".to_string());
    Ok(unwrap_content.to_owned())
  } else {
    let path_string: String = path.exists().to_string();
    let path_owned: String = path_string.to_owned();
   Ok("Error Impossible de récupérer data {}".to_owned()+&path_owned)
  }
}

fn main() {
    tauri::Builder::default()
    .setup(|app| {
        #[cfg(debug_assertions)] // only include this code on debug builds
        {
          let window = app.get_window("main").unwrap();
          window.open_devtools();
          window.close_devtools();
        }
        Ok(())
      })
        .invoke_handler(tauri::generate_handler![get_json, set_json])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
