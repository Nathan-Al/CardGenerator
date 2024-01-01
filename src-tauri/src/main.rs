// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::env;
use std::fs;
use std::io::Error;
use std::path::Path;
use crate::errors::CommandResult;
mod errors;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn set_json(data: String) -> CommandResult<bool> {
  println!(" - : COMMAND : - SETJSON");
  println!("{:?}",data);
  let path: &Path = Path::new("../src/json/datas.json");
  if path.exists() == true {
    // let file = fs::OpenOptions::new()
    // .read(true)
    // .write(true)
    // .create(true)
    // .open(path);
    let result: Result<(), Error> = fs::write(path, data);
    println!("{:?}",result);
    Ok(true)
  } else {
   Ok(false)
  }
}

#[tauri::command]
fn get_json() -> CommandResult<String> {
  println!(" - : COMMAND : - GETJSON");
  let path: &Path = Path::new("../src/json/datas.json");
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
        .invoke_handler(tauri::generate_handler![greet, set_json, get_json])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
