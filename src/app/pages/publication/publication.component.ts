import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-publication",
  templateUrl: "./publication.component.html",
  styleUrls: ["./publication.component.css"],
})
export class PublicationComponent implements OnInit {
  public declare publicationId: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.publicationId = this.route.snapshot.paramMap.get("publicationId");
    console.log(this.publicationId);
  }
}
