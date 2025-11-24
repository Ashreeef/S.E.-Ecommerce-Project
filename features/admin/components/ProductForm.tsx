'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { useProductForm } from '@/hooks/useProductForm';
import { Upload, X, Plus } from 'lucide-react';
import '@/styles/admin-dashboard.css';
import '@/styles/product-form.css';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = [
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Brown', value: 'brown', hex: '#8B4513' },
  { name: 'Blue', value: 'blue', hex: '#0000FF' },
  { name: 'Dark Blue', value: 'dark-blue', hex: '#00008B' },
];
const CATEGORIES = ['Jeans', 'Shirts', 'Polos', 'Jackets', 'Trousers', 'Sweaters'];
const FITS = ['Baggy', 'Slim', 'Regular', 'Oversized', 'Relaxed'];
const STATUS_OPTIONS = ['Available', 'Unavailable', 'Draft'];
const DISCOUNT_TYPES = ['Back to school', 'Seasonal', 'Clearance', 'Flash sale', 'New customer'];

interface ProductFormProps {
  productId?: string;
  initialData?: {
    name?: string;
    description?: string;
    modelDetails?: string;
    status?: 'Available' | 'Unavailable' | 'Draft';
    size?: string;
    color?: string;
    gender?: 'MEN' | 'WOMEN' | 'UNISEX';
    category?: string;
    fit?: string;
    basePrice?: number;
    stock?: number;
    discount?: number;
    discountType?: string;
    imageUrls?: string[];
  };
  isEdit?: boolean;
}

export default function ProductForm({ productId, initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const {
    formData,
    updateField,
    updateImages,
    removeImage,
    submitForm,
    isLoading,
    errors,
    initializeForm,
  } = useProductForm();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Initialize form with product data if editing
  useEffect(() => {
    if (isEdit && initialData) {
      const formDataToSet = {
        name: initialData.name || '',
        description: initialData.description || '',
        modelDetails: initialData.modelDetails || '',
        status: initialData.status || 'Available',
        size: initialData.size || '',
        color: initialData.color || '',
        gender: initialData.gender || 'UNISEX',
        category: initialData.category || '',
        fit: initialData.fit || '',
        basePrice: initialData.basePrice || 0,
        stock: initialData.stock || 0,
        discount: initialData.discount || 0,
        discountType: initialData.discountType || '',
        images: [],
        imageUrls: initialData.imageUrls || [],
      };
      initializeForm(formDataToSet);
      // Set image preview URLs from existing images
      if (initialData.imageUrls && initialData.imageUrls.length > 0) {
        setImagePreviewUrls(initialData.imageUrls);
      }
    }
  }, [isEdit, initialData, initializeForm]);

  // Create preview URLs for uploaded images
  useEffect(() => {
    const uploadedUrls = formData.images.map((file) => URL.createObjectURL(file));
    const existingUrls = formData.imageUrls || [];
    setImagePreviewUrls([...existingUrls, ...uploadedUrls]);

    // Cleanup function to revoke URLs
    return () => {
      uploadedUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.images, formData.imageUrls]);

  const handleImageUpload = (files: FileList | null, index?: number) => {
    if (!files || files.length === 0) return;

    if (index !== undefined) {
      // Update specific thumbnail
      const file = files[0];
      const newImages = [...formData.images];
      newImages[index] = file;
      updateField('images', newImages);
    } else {
      // Main image upload
      updateImages(Array.from(files));
    }
  };

  const handleSaveDraft = async () => {
    const result = await submitForm(true, isEdit, productId);
    if (result.success) {
      alert('Draft saved successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleSubmit = async () => {
    const result = await submitForm(false, isEdit, productId);
    if (result.success) {
      alert(isEdit ? 'Product updated successfully!' : 'Product added successfully!');
      router.push('/admin/products');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const allImageUrls = [...(formData.imageUrls || []), ...imagePreviewUrls.filter(url => !formData.imageUrls?.includes(url))];

  return (
    <div className="page-container product-form-container">
      {/* Breadcrumb */}
      <div className="product-form-breadcrumb">
        <span>Dashboard</span>
        <span className="product-form-breadcrumb-separator">/</span>
        <span>Products</span>
        <span className="product-form-breadcrumb-separator">/</span>
        <span className="product-form-breadcrumb-active">
          {isEdit ? 'Edit product' : 'New product'}
        </span>
      </div>

      {/* Page Header */}
      <div className="page-header mb-6">
        <h2 className="page-title">
          {isEdit ? 'Edit product' : 'Add new product to the store'}
        </h2>
      </div>

      {/* Form */}
      <div className="product-form-grid">
        {/* Left Column */}
        <div className="product-form-column">
          {/* Product Images Section */}
          <div className="product-images-section">
            <h3 className="product-images-title">Product Images</h3>
            
            {/* Main Image Upload */}
            <div
              className="product-image-upload"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files)}
              />
              {allImageUrls.length > 0 ? (
                <div className="product-image-preview-container">
                  <img
                    src={allImageUrls[0]}
                    alt="Main product"
                    className="product-image-preview"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (formData.imageUrls && formData.imageUrls.length > 0) {
                        const newUrls = formData.imageUrls.slice(1);
                        updateField('imageUrls', newUrls);
                      } else {
                        removeImage(0);
                      }
                    }}
                    className="product-image-remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="product-image-upload-icon" />
                  <p className="product-image-upload-text">
                    <span className="product-image-upload-link">↑ Drop your files, or Browse</span>
                  </p>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="product-thumbnail-grid">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="product-thumbnail-item"
                  onClick={() => thumbnailInputRefs.current[index]?.click()}
                >
                  <input
                    ref={(el) => {(thumbnailInputRefs.current[index] = el)}}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files, index + 1)}
                  />
                  {allImageUrls[index + 1] ? (
                    <div className="product-thumbnail-preview">
                      <img
                        src={allImageUrls[index + 1]}
                        alt={`Thumbnail ${index + 1}`}
                        className="product-thumbnail-image"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (formData.imageUrls && formData.imageUrls.length > index + 1) {
                            const newUrls = formData.imageUrls.filter((_, i) => i !== index + 1);
                            updateField('imageUrls', newUrls);
                          } else {
                            removeImage(index + 1);
                          }
                        }}
                        className="product-thumbnail-remove"
                      >
                        <X className="product-thumbnail-icon" />
                      </button>
                    </div>
                  ) : (
                    <Plus className="product-thumbnail-add-icon" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Model Details Section */}
          <div className="model-details-section">
            <h3 className="model-details-title">Model details</h3>
            <textarea
              value={formData.modelDetails}
              onChange={(e) => updateField('modelDetails', e.target.value)}
              placeholder="Enter model details (e.g., Height, Waist, Thighs, etc.)"
              className="model-details-textarea"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="product-form-column">
          {/* Product Information */}
          <div className="product-info-section">
            <h3 className="product-info-title">Product Information</h3>

            {/* Product Name */}
            <div>
              <Input
                label="Product name"
                value={formData.name}
                onChange={(value) => updateField('name', value)}
                placeholder="denim baggy jeans"
                error={!!errors.name}
                caption={errors.name}
              />
            </div>

            {/* Description */}
            <div>
              <label className="product-form-label">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Enter product description"
                className="product-form-textarea"
              />
              {errors.description && (
                <p className="product-form-error">{errors.description}</p>
              )}
            </div>

            {/* Product Status */}
            <div>
              <Input
                label="Product status"
                variant="list"
                value={formData.status}
                onChange={(value) => updateField('status', value as any)}
                options={STATUS_OPTIONS}
                placeholder="Select status"
              />
            </div>

            {/* Size */}
            <div>
              <Input
                label="Size"
                variant="list"
                value={formData.size}
                onChange={(value) => updateField('size', value)}
                options={SIZES}
                placeholder="Select size"
              />
            </div>

            {/* Color */}
            <div>
              <label className="product-form-label">
                Color
              </label>
              <div className="product-color-selector">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => updateField('color', color.value)}
                    className={`product-color-swatch ${
                      formData.color === color.value
                        ? 'product-color-swatch-selected'
                        : 'product-color-swatch-default'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
                <div className="product-color-dropdown">
                  <Input
                    variant="list"
                    value={formData.color}
                    onChange={(value) => updateField('color', value)}
                    options={COLORS.map(c => c.name)}
                    placeholder="More colors"
                    className="w-32"
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="product-form-label">
                Gender
              </label>
              <div className="product-gender-selector">
                {(['MEN', 'WOMEN', 'UNISEX'] as const).map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => updateField('gender', gender)}
                    className={`product-gender-button ${
                      formData.gender === gender
                        ? 'product-gender-button-selected'
                        : 'product-gender-button-default'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <Input
                label="Category"
                variant="list"
                value={formData.category}
                onChange={(value) => updateField('category', value)}
                options={CATEGORIES}
                placeholder="Select category"
                error={!!errors.category}
                caption={errors.category}
              />
            </div>

            {/* Fit */}
            <div>
              <Input
                label="Fit"
                variant="list"
                value={formData.fit}
                onChange={(value) => updateField('fit', value)}
                options={FITS}
                placeholder="Select fit"
              />
            </div>

            {/* Base Pricing */}
            <div>
              <label className="product-form-label">
                Base pricing
              </label>
              <div className="product-input-group">
                <NumberInput
                  value={formData.basePrice}
                  onChange={(value) => updateField('basePrice', value)}
                  min={0}
                  max={999999}
                  allowDecimals={true}
                  className="flex-1"
                  error={!!errors.basePrice}
                />
                <span className="product-input-currency">DZD</span>
              </div>
              {errors.basePrice && (
                <p className="product-form-error">{errors.basePrice}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="product-form-label">
                Stock
              </label>
              <div className="product-input-group">
                <NumberInput
                  value={formData.stock}
                  onChange={(value) => updateField('stock', value)}
                  min={0}
                  max={999999}
                  allowDecimals={false}
                  className="flex-1"
                  error={!!errors.stock}
                />
                <span className="product-input-currency">piece</span>
              </div>
              {errors.stock && (
                <p className="product-form-error">{errors.stock}</p>
              )}
            </div>

            {/* Discount */}
            <div>
              <label className="product-form-label">
                Discount
              </label>
              <div className="product-input-group">
                <NumberInput
                  value={formData.discount}
                  onChange={(value) => updateField('discount', value)}
                  min={0}
                  max={100}
                  allowDecimals={true}
                  className="flex-1"
                  error={!!errors.discount}
                />
                <span className="product-input-currency">%</span>
              </div>
              {errors.discount && (
                <p className="product-form-error">{errors.discount}</p>
              )}
            </div>

            {/* Type of Discount */}
            <div>
              <Input
                label="Type of discount"
                variant="list"
                value={formData.discountType}
                onChange={(value) => updateField('discountType', value)}
                options={DISCOUNT_TYPES}
                placeholder="Select discount type"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="product-form-actions">
        <Button
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isLoading}
          className="product-form-button"
        >
          Save draft
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="product-form-button product-form-button-primary"
        >
          {isLoading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update product' : 'Add product')}
        </Button>
      </div>
    </div>
  );
}

