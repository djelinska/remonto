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
}
