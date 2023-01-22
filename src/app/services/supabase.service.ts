import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  private supabase: SupabaseClient;
  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from("grabits").download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from("grabits").upload(filePath, file, {
      upsert: true,
    });
  }

  getPublicUrl(path: string) {
    return this.supabase.storage.from("grabits").getPublicUrl(path, {
      transform: {
        width: 400,
        height: 400,
        resize: "cover",
      },
    });
  }
}
