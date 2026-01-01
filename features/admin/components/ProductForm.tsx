'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/ui/custom-button';
import { NumberInput } from '@/components/ui/number-input';
import { useProductForm, ProductFormData } from '@/hooks/useProductForm';
import { useProduct } from '@/hooks/useProducts';
import { Upload, X, Plus } from 'lucide-react';
import '@/styles/admin-dashboard.css';
import '@/styles/product-form.css';
import Link from 'next/link';

const COLORS = [
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Brown', value: 'brown', hex: '#8B4513' },
  { name: 'Blue', value: 'blue', hex: '#0000FF' },
  { name: 'Dark Blue', value: 'dark-blue', hex: '#00008B' },
];
const CATEGORIES = ['Jeans', 'Shirts', 'Polos', 'Jackets', 'Trousers', 'Sweaters'];
const FITS = ['Baggy', 'Slim', 'Regular', 'Oversized', 'Relaxed'];
const DISCOUNT_TYPES = ['Back to school', 'Seasonal', 'Clearance', 'Flash sale', 'New customer'];

interface ProductFormProps {
  productId?: string;
  initialData?: Partial<ProductFormData>; 
  isEdit?: boolean;
}

export default function ProductForm({ productId, initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const {
    formData,
    updateField,
    removeImage,
    submitForm,
    isLoading,
    errors,
    initializeForm,
  } = useProductForm();

  // If productId is provided and no initialData, fetch product to initialize the form
  const { product: fetchedProduct } = useProduct(productId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form with product data if editing
  useEffect(() => {
    if (!isEdit) return;

    // priority: explicit initialData prop, otherwise fetched product
    const source = initialData || fetchedProduct;
    if (source) {
      // Handle both Product type and ProductFormData type
      const getName = (s: typeof source): string => {
        if ('name' in s && typeof s.name === 'string') return s.name;
        if ('title' in s && typeof s.title === 'string') return s.title;
        return '';
      };
      
      const getImages = (s: typeof source): string[] => {
        if ('imageUrls' in s && s.imageUrls) return s.imageUrls;
        if ('images' in s && Array.isArray(s.images)) {
          return s.images.map((img) => (typeof img === 'string' ? img : 'url' in img ? img.url : ''));
        }
        if ('image' in s && typeof s.image === 'string') return [s.image];
        return [];
      };
      
      const getString = (key: string, altKey?: string): string => {
        if (key in source && typeof source[key as keyof typeof source] === 'string') {
          return source[key as keyof typeof source] as string;
        }
        if (altKey && altKey in source && typeof source[altKey as keyof typeof source] === 'string') {
          return source[altKey as keyof typeof source] as string;
        }
        return '';
      };
      
      const getNumber = (key: string): number => {
        if (key in source && typeof source[key as keyof typeof source] === 'number') {
          return source[key as keyof typeof source] as number;
        }
        return 0;
      };
      
      const formDataToSet: ProductFormData = {
        name: getName(source),
        description: getString('description'),
        modelDetails: getString('modelDetails', 'model_details'),
        availableSizes: ('availableSizes' in source && Array.isArray(source.availableSizes)) 
          ? source.availableSizes.join(', ') 
          : getString('availableSizes'),
        isAvailable: ('isAvailable' in source && typeof source.isAvailable === 'boolean') ? source.isAvailable : true,
        price: getNumber('price'),
        originalPrice: ('originalPrice' in source && typeof source.originalPrice === 'number') ? source.originalPrice : undefined,
        image: getString('image'),
        color: getString('color'),
        gender: getString('gender') as 'MEN' | 'WOMEN' | 'UNISEX' || 'UNISEX',
        category: getString('category'),
        fit: getString('fit'),
        stock: getNumber('stock'),
        discount: getNumber('discount'),
        discountType: getString('discountType', 'discount_type'),
        images: [],
        imageUrls: getImages(source),
      };
      initializeForm(formDataToSet);
      // Set image preview URLs from existing images
      const existingUrls = formDataToSet.imageUrls || [];
      if (existingUrls.length > 0) setImagePreviewUrls(existingUrls);
    }
  }, [isEdit, initialData, fetchedProduct, initializeForm]);

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

  const uploadImagesToStorage = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      files.forEach(file => {
        uploadFormData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload images');
      }

      return result.urls || [];
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Error uploading images: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (files: FileList | null, index?: number) => {
    if (!files || files.length === 0) return;

    const filesToUpload = Array.from(files);
    
    // Upload to Supabase storage
    const uploadedUrls = await uploadImagesToStorage(filesToUpload);
    
    if (uploadedUrls.length > 0) {
      if (index !== undefined) {
        // Update specific thumbnail
        const newUrls = [...(formData.imageUrls || [])];
        newUrls[index] = uploadedUrls[0];
        updateField('imageUrls', newUrls);
      } else {
        // Add to main images
        const existingUrls = formData.imageUrls || [];
        updateField('imageUrls', [...existingUrls, ...uploadedUrls]);
      }
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
    if (isUploading) {
      alert('Please wait for images to finish uploading');
      return;
    }

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
        <Link href="/admin" className="text-gray-600 hover:underline">Dashboard</Link>
        <span className="product-form-breadcrumb-separator">/</span>
        <Link href="/admin/products" className="text-gray-600 ">Products</Link>
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
              onClick={() => !isUploading && fileInputRef.current?.click()}
              style={{ cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.6 : 1 }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files)}
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="product-image-upload-loading">
                  <p className="product-image-upload-text">Uploading images...</p>
                </div>
              ) : allImageUrls.length > 0 ? (
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
                      }
                    }}
                    className="product-image-remove-btn"
                    disabled={isUploading}
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

            {/* Available Sizes */}
            <div>
              <Input
                label="Available Sizes"
                value={formData.availableSizes}
                onChange={(value) => updateField('availableSizes', value)}
                placeholder="Enter sizes separated by comma (e.g., S, M, L, XL)"
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

            {/* Price */}
            <div>
              <label className="product-form-label">
                Price
              </label>
              <div className="product-input-group">
                <NumberInput
                  value={formData.price}
                  onChange={(value) => updateField('price', value)}
                  min={0}
                  max={999999}
                  allowDecimals={true}
                  className="flex-1"
                  error={!!errors.price}
                />
                <span className="product-input-currency">DZD</span>
              </div>
              {errors.price && (
                <p className="product-form-error">{errors.price}</p>
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
        <CustomButton
          variant="outlined"
          text="Save draft"
          onClick={handleSaveDraft}
          disabled={isLoading || isUploading}
          className="product-form-button"
        />
        <CustomButton
          text={isEdit ? 'Update product' : 'Add product'}
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isLoading || isUploading}
          className="product-form-button product-form-button-primary"
        />
      </div>
    </div>
  );
}

