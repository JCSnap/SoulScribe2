import { getFunctions, httpsCallable } from "firebase/functions";

// Get the Firebase Functions instance
const functions = getFunctions();

// Create a callable function to generate an image
const generateImage = httpsCallable(functions, "generateImage");

/**
 * Generates a test image using the generateImage Firebase callable function.
 * @returns {Promise<string>} - The generated image URL.
 */
const generateTestImage = async () => {
  console.log("starting");

  // Define the data object with the prompt and model for image generation
  const data = {
    prompt: "A boy riding a bicycle",
    model: "midjourney",
  };

  // Call the generateImage function with the provided data
  const image = await generateImage(data)
    .then((result) => {
      console.log(result);
      
      // Parse the response data from the result
      const parsedResponse = JSON.parse(result.data);
      console.log(parsedResponse);
      
      // Extract the generated image URL from the parsed response
      const imageUrl = parsedResponse.output[0];
      console.log(imageUrl);
      return imageUrl;
    });

  return image;
};

export default generateTestImage;
