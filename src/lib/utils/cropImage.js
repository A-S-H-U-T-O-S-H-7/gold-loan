function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not read the image'));
    image.src = src;
  });
}

// Size of the box needed to hold a width x height image rotated by `degrees`.
function rotatedSize(width, height, degrees) {
  const radians = (degrees * Math.PI) / 180;
  return {
    width: Math.abs(Math.cos(radians) * width) + Math.abs(Math.sin(radians) * height),
    height: Math.abs(Math.sin(radians) * width) + Math.abs(Math.cos(radians) * height),
  };
}

/**
 * Returns a new File holding the `area` (in pixels, as given by react-easy-crop) of the
 * image after rotating it. Keeps the original name and type; JPEGs are saved at 92% quality.
 */
export async function cropImageFile(sourceUrl, area, rotation, originalFile) {
  const image = await loadImage(sourceUrl);
  const bounds = rotatedSize(image.naturalWidth, image.naturalHeight, rotation);

  // Draw the whole image rotated around its centre...
  const rotatedCanvas = document.createElement('canvas');
  rotatedCanvas.width = Math.round(bounds.width);
  rotatedCanvas.height = Math.round(bounds.height);
  const rotatedContext = rotatedCanvas.getContext('2d');
  rotatedContext.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
  rotatedContext.rotate((rotation * Math.PI) / 180);
  rotatedContext.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

  // ...then copy out just the selected area.
  const output = document.createElement('canvas');
  output.width = Math.round(area.width);
  output.height = Math.round(area.height);
  output.getContext('2d').drawImage(
    rotatedCanvas,
    Math.round(area.x), Math.round(area.y), output.width, output.height,
    0, 0, output.width, output.height,
  );

  const type = originalFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const blob = await new Promise((resolve, reject) => {
    output.toBlob((result) => (result ? resolve(result) : reject(new Error('Could not crop the image'))), type, 0.92);
  });
  return new File([blob], originalFile.name, { type, lastModified: Date.now() });
}
