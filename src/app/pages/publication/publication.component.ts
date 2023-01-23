import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IPublication } from "../../interfaces/publication";
import { ApiService } from "../../services/api.service";
import { SupabaseService } from "../../services/supabase.service";

@Component({
  selector: "app-publication",
  templateUrl: "./publication.component.html",
  styleUrls: ["./publication.component.css"],
})
export class PublicationComponent implements OnInit {
  public declare publicationId: string;
  public declare publication: IPublication;
  public declare image: {
    src: string;
  };
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    this.publicationId = this.route.snapshot.paramMap.get("publicationId");
    console.log(this.publicationId);
    this.fetchData();
  }

  async fetchData() {
    this.publication = await this.apiService
      .UserPublication(this.publicationId)
      .toPromise();
    console.log(this.publication);
    const {
      data: { publicUrl },
    } = this.supabaseService.getPublicUrl(this.publication.urlImg);
    this.image = { src: publicUrl };
  }
}
