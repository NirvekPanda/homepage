import { parse } from 'exifr';

/**
 * Extracts EXIF metadata from an image file and returns structured data
 * compatible with the Portfolio Background API
 * 
 * @param {File} file - The image file to extract metadata from
 * @returns {Promise<Object>} - Object containing extracted metadata
 */
export const pullPhotoMetadata = async (file) => {

  const isValidImage = file.type.startsWith('image/') || 
                      file.name.toLowerCase().endsWith('.heic') || 
                      file.name.toLowerCase().endsWith('.heif') ||
                      file.type === 'image/heic' || 
                      file.type === 'image/heif';
  
  if (!file || !isValidImage) {
    throw new Error('Invalid file type. Please select an image file.');
  }

  console.log('Starting EXIF extraction for file:', file.name, 'Type:', file.type, 'Size:', file.size);

  try {

    const isHeicFile = file.name.toLowerCase().endsWith('.heic') || 
                      file.name.toLowerCase().endsWith('.heif') ||
                      file.type === 'image/heic' || 
                      file.type === 'image/heif';

    let exifData = null;
    
    if (isHeicFile) {
      console.log('HEIC file detected, attempting EXIF extraction...');
      try {
        exifData = await parse(file, {
          gps: true,
          ifd0: true,
          exif: true,
          iptc: true,
          icc: true,
          jfif: true,
          ihdr: true
        });
        console.log('Raw EXIF data from HEIC:', exifData);
      } catch (heicError) {
        console.warn('EXIF extraction failed for HEIC file:', heicError);
        exifData = null;
      }
    } else {
      exifData = await parse(file, {
        gps: true,
        ifd0: true,
        exif: true,
        iptc: true,
        icc: true,
        jfif: true,
        ihdr: true
      });
      console.log('Raw EXIF data:', exifData);
    }

    const metadata = {
      title: '',
      description: '',
      latitude: '',
      longitude: '',
      locationName: '',
      camera: '',
      dateTaken: '',
      originalData: exifData || {}
    };

    if (file.name) {
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      metadata.title = baseName.replace(/[-_]/g, ' ');
    }


    if (exifData) {

      if (exifData.latitude && exifData.longitude) {
        metadata.latitude = exifData.latitude.toString();
        metadata.longitude = exifData.longitude.toString();
      }

      const make = exifData.Make || exifData.make;
      const model = exifData.Model || exifData.model;
      if (make || model) {
        metadata.camera = `${make || ''} ${model || ''}`.trim();
      }

      const dateTime = exifData.DateTime || exifData.dateTime;
      const dateTimeOriginal = exifData.DateTimeOriginal || exifData.dateTimeOriginal;
      const dateTimeDigitized = exifData.DateTimeDigitized || exifData.dateTimeDigitized;
      
      const dateTaken = dateTimeOriginal || dateTimeDigitized || dateTime;
      if (dateTaken) {
        metadata.dateTaken = formatExifDate(dateTaken);
      }

      const width = exifData.ExifImageWidth || exifData.PixelXDimension || exifData.width;
      const height = exifData.ExifImageHeight || exifData.PixelYDimension || exifData.height;

      const descriptionParts = [];
      if (metadata.camera) {
        descriptionParts.push(`Taken with ${metadata.camera}`);
      }
      if (metadata.dateTaken) {
        descriptionParts.push(`on ${metadata.dateTaken}`);
      }
      if (width && height) {
        descriptionParts.push(`(${width}x${height})`);
      }
      
      if (descriptionParts.length > 0) {
        metadata.description = descriptionParts.join(' ');
      } else {
        metadata.description = `Image file: ${file.name}`;
      }
    } else {
      if (isHeicFile) {
        metadata.description = `HEIC file: ${file.name} (EXIF data not available)`;
      } else {
        metadata.description = `Image file: ${file.name}`;
      }
    }

    console.log('Processed metadata:', metadata);
    return metadata;

  } catch (error) {
    console.warn('Error extracting EXIF data:', error);

    const basicMetadata = {
      title: file.name ? file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : '',
      description: `Image file: ${file.name}`,
      latitude: '',
      longitude: '',
      locationName: '',
      camera: '',
      dateTaken: '',
      originalData: { error: error.message }
    };
    
    console.log('Returning basic metadata:', basicMetadata);
    return basicMetadata;
  }
};

/**
 * Converts GPS coordinates from DMS (Degrees, Minutes, Seconds) to decimal degrees
 * @param {Array} dms - Array of [degrees, minutes, seconds]
 * @param {String} ref - Reference direction ('N', 'S', 'E', 'W')
 * @returns {Number} - Decimal degrees
 */
const convertDMSToDD = (dms, ref) => {
  if (!dms || !Array.isArray(dms) || dms.length !== 3) {
    return null;
  }

  let dd = dms[0] + dms[1]/60 + dms[2]/(60*60);
  if (ref === 'S' || ref === 'W') {
    dd = dd * -1;
  }
  return dd;
};

/**
 * Formats EXIF date string to readable format
 * @param {String|Date} exifDate - Date string from EXIF or Date object
 * @returns {String} - Formatted date string
 */
const formatExifDate = (exifDate) => {
  if (!exifDate) return '';
  
  try {
    let date;
    
    if (exifDate instanceof Date) {
      date = exifDate;
    } else if (typeof exifDate === 'string') {
      if (exifDate.includes(':')) {
        const [datePart, timePart] = exifDate.split(' ');
        const [year, month, day] = datePart.split(':');
        const [hour, minute, second] = timePart.split(':');
        date = new Date(year, month - 1, day, hour, minute, second);
      } else {
        date = new Date(exifDate);
      }
    } else {
      return exifDate.toString();
    }
    
    if (isNaN(date.getTime())) {
      return exifDate.toString();
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.warn('Error formatting EXIF date:', error);
    return exifDate.toString();
  }
};

/**
 * Gets location name from coordinates using reverse geocoding
 * This is a placeholder - you would integrate with a geocoding service
 * @param {Number} latitude - Latitude in decimal degrees
 * @param {Number} longitude - Longitude in decimal degrees
 * @returns {Promise<String>} - Location name or empty string
 */
export const getLocationName = async (latitude, longitude) => {
  try {
    console.log(`Getting location name for coordinates: ${latitude}, ${longitude}`);
    return ''; 
  } catch (error) {
    console.warn('Error getting location name:', error);
    return '';
  }
};
