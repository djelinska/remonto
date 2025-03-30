import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { of, zip } from 'rxjs';
import { ImageService } from '../../../../../core/services/image/image.service';
import { ProjectDto } from '../../../../../shared/models/project.dto';
import { ProjectService } from '../../../../../core/services/project/project.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../../../../shared/components/confirm-modal/confirm-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-info-images',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './info-images.component.html',
  styleUrl: './info-images.component.scss',
})
export class InfoImagesComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  @Input() projectId!: string;
  project!: ProjectDto;

  imagePreview: string | null = null;
  selectedFile: File | null = null;
  projectImages: { url: string; preview: string }[] = [];
  isLoading = false;
  deletingImage: string | null = null;

  constructor(
    private imageService: ImageService,
    private projectService: ProjectService,
    private modalService: BsModalService
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
      this.isLoading = true;
      this.imageService.uploadImage(this.selectedFile).subscribe({
        next: (imageUrl) => {
          if (imageUrl) {
            this.projectService
              .addImageToProject(this.projectId, imageUrl)
              .subscribe({
                next: () => {
                  this.resetUploadForm();
                  this.loadProjectImages();
                },
                error: (err) => {
                  console.error('Error adding image to project:', err);
                  this.isLoading = false;
                }
              });
          }
        },
        error: (err) => {
          console.error('Error uploading image:', err);
          this.isLoading = false;
        }
      });
    }
  }

  deleteImage(imageUrl: string): void {
    const modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        title: 'Usuń zdjęcie',
        message: 'Czy na pewno chcesz usunąć to zdjęcie?',
        btnTitle: 'Usuń'
      }
    });
  
    modalRef.content!.confirmCallback = () => {
      this.deletingImage = imageUrl;
      this.imageService.deleteImage(imageUrl).subscribe({
        next: () => {
          this.projectService
            .deleteImageFromProject(this.projectId, imageUrl)
            .subscribe({
              next: () => {
                this.loadProjectImages();
                this.deletingImage = null;
              },
              error: (err) => {
                console.error('Error removing image from project:', err);
                this.deletingImage = null;
              }
            });
        },
        error: (err) => {
          console.error('Error deleting image:', err);
          this.deletingImage = null;
        }
      });
    };
  
    modalRef.content!.cancelCallback = () => {
      this.deletingImage = null;
    };
  }

  private loadProjectImages(): void {
    this.isLoading = true;
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project) => {
        const imageUrls = project.imageUrls || []; // Handle undefined case
        if (imageUrls.length > 0) {
          const imageRequests = imageUrls.map((url) =>
            url ? this.imageService.getImage(url) : of(null)
          );
  
          zip(...imageRequests).subscribe({
            next: (imagePreviews) => {
              this.projectImages = imageUrls
                .map((url, index) => ({ url, preview: imagePreviews[index] }))
                .filter((item): item is { url: string; preview: string } => 
                  item.preview !== null
                );
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Error loading images:', err);
              this.isLoading = false;
            }
          });
        } else {
          this.projectImages = [];
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading project:', err);
        this.isLoading = false;
      }
    });
  }

  private resetUploadForm(): void {
    this.imagePreview = null;
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
    this.isLoading = false;
  }
}