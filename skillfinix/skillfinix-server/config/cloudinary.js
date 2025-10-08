const cloudinary = require('cloudinary').v2;

const configureCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log('Cloudinary configured successfully');
    
    // Test the connection
    cloudinary.api.ping()
      .then(() => console.log('Cloudinary connection successful'))
      .catch(err => console.error('Cloudinary connection failed:', err));
      
  } catch (error) {
    console.error('Cloudinary configuration error:', error);
  }
};

// Export both the configuration function and the cloudinary instance
module.exports = {
  configureCloudinary,
  cloudinary
};