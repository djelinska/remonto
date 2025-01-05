package com.remonto.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "elements")
public abstract class Element {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 3, max = 100)
    @Column(name = "name")
    private String name;

    @Pattern(regexp = "https?://.*\\.(jpg|png)$", message = "Image URL must end with .jpg or .png")
    @Column(name = "image_url")
    private String imageUrl;

    @Size(max = 50)
    @Column(name = "status")
    private String status;

    @DecimalMin(value = "0.0", inclusive = false)
    @Digits(integer = 10, fraction = 2)
    @Column(name = "cost")
    private BigDecimal cost;

    @NotNull
    @Min(0)
    @Column(name = "quantity")
    private Integer quantity;

    @Size(max = 255)
    @Column(name = "location")
    private String location;

    @Pattern(regexp = "https?://.*", message = "Link must be a valid URL")
    @Column(name = "link")
    private String link;

    @Size(max = 500)
    @Column(name = "note")
    private String note;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

     public Long getId() { return id; }
     public void setId(Long id) { this.id = id; }
     public String getName() { return name; }
     public void setName(String name) { this.name = name; }
     public String getImageUrl() { return imageUrl; }
     public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
     public String getStatus() { return status; }
     public void setStatus(String status) { this.status = status; }
     public BigDecimal getCost() { return cost; }
     public void setCost(BigDecimal cost) { this.cost = cost; }
     public Integer getQuantity() { return quantity; }
     public void setQuantity(Integer quantity) { this.quantity = quantity; }
     public String getLocation() { return location; }
     public void setLocation(String location) { this.location = location; }
     public String getLink() { return link; }
     public void setLink(String link) { this.link = link; }
     public String getNote() { return note; }
     public void setNote(String note) { this.note = note; }
     public Project getProject() { return project; }
     public void setProject(Project project) { this.project = project; }
}
