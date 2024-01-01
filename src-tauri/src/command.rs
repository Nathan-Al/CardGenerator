#[tauri::command]
fn modify_json() {
  println!("I was invoked from JS!");
}
