import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { of, zip } from 'rxjs';

import { ImageService } from '../../../../../core/services/image/image.service';
import { ProjectDto } from '../../../../../shared/models/project.dto';
import { ProjectService } from '../../../../../core/services/project/project.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-info-images',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './info-images.component.html',
  styleUrl: './info-images.component.scss',
})
export class InfoImagesComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  @Input() projectId!: string;
  project!: ProjectDto;

  imagePreview: string | null = null;
  selectedFile: File | null = null;

  projectImages: string[] = [];

  constructor(
    private imageService: ImageService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadProjectImages();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImage(): void {
    if (this.selectedFile) {
      this.imageService.uploadImage(this.selectedFile).subscribe((imageUrl) => {
        if (imageUrl) {
          this.projectService
            .addImageToProject(this.projectId, imageUrl)
            .subscribe(() => {
              this.imagePreview = null;
              this.selectedFile = null;
              this.fileInput.nativeElement.value = '';

              this.loadProjectImages();
            });
        }
      });
    }
  }

  private loadProjectImages(): void {
    this.projectService.getProjectById(this.projectId).subscribe((project) => {
      if (project.imageUrls && project.imageUrls.length > 0) {
        const imageRequests = project.imageUrls.map((url) =>
          url ? this.imageService.getImage(url) : of(null)
        );

        zip(...imageRequests).subscribe((imageUrls) => {
          this.projectImages = imageUrls.filter(
            (url): url is string => url !== null
          );
        });
      } else {
        this.projectImages = [];
      }
    });
  }
}
