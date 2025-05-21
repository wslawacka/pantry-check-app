const barcodeRegex = /^(\d{8}|\d{12,13})$/;

export function validateName(name: string) {
    if (!name) return 'Name is required';
    if (name.length < 3) return 'Name must be at least 3 characters long';
    if (name.length > 100) return 'Name must be at most 100 characters long';
    return null;
}

export function validateCategory(category: string) {
    if (!category) return 'Category is required';
    if (!['dairy', 'grains', 'meat', 'vegetables', 'fruits', 'beverages', 'other'].includes(category))
        return 'Invalid category';
    return null;
}

export function validateExpiryDate(expiryDate: string) {
    if (!expiryDate) return 'Expiry date is required';
    return null;
}

export function validateQuantity(quantity: number) {
    if (quantity === undefined || quantity === null) return 'Quantity is required';
    if (!Number.isInteger(quantity) || quantity <= 0) return 'Quantity must be a positive integer';
    return null;
}

export function validateBarcode(barcode: string) {
    if (!barcode) return null;
    if (!barcodeRegex.test(barcode)) return 'Invalid barcode';
    return null;
}