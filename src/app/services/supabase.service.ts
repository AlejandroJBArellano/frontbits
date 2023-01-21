import { Injectable } from "@angular/core";
import { SupabaseClient } from "@supabase/supabase-js";
@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  private supabase: SupabaseClient;
  constructor() {}

  downLoadImage(path: string) {
    return this.supabase.storage.from("imagePublication").download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage
      .from("imagePublication")
      .upload(filePath, file);
  }
}
