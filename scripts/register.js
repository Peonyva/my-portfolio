// Round 1 //

// Upload Image //
function handleImageUpload(input, divPreviewID) {
  const uploader = document.getElementById(divPreviewID);
  const file = input.files[0];

  if (!file) return;
  if (!isValidImageFile(file)) {
    showError("Invalid file","Please select an image file (JPG, PNG, GIF) no larger than 10 MB.");
    input.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    uploader.innerHTML = createImagePreviewHTML(e.target.result, input.id, divPreviewID, file.name);
  };
  reader.onerror = function () {
    showError("An error occurred.", "Cannot read file.");
    input.value = "";
  };
  reader.readAsDataURL(file);
}

// Sub Funtion

function isValidImageFile(file) {
  if (!file) return false;

  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  return validTypes.includes(file.type) && file.size <= maxSize;
}

function removeImage(divPreviewID, inputFileID) {
  const uploader = document.getElementById(divPreviewID);
  const input = document.getElementById(inputFileID);

  if (input) input.value = "";
  if (uploader) {
    uploader.innerHTML = returnImageValueHTML(inputFileID);
  }
}

function createImagePreviewHTML(imageSrc, inputFileID, divPreviewID, fileName = "") 
{
  return `
    <div class="image-preview">
        <img src="${imageSrc}" alt="Preview">
        ${fileName ? `<p>${fileName}</p>` : ""}
    </div>
    <div class="preview-actions">
        <button type="button" class="btn btn-primary" onclick="document.getElementById('${inputFileID}').click()">Change Image</button>
        <button type="button" class="btn btn-danger" onclick="removeImage('${divPreviewID}', '${inputFileID}')">Remove</button>
    </div>
  `;
}

function returnImageValueHTML(inputFileID) {
  return `
        <div class="upload-placeholder">
            <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <button type="button" class="btn btn-primary" onclick="document.getElementById('${inputFileID}').click()">
                Upload Image
            </button>
            <p class="upload-hint">PNG, JPG, GIF up to 10MB</p>
        </div>
    `;
}

async function showError(title, text) {
  return await Swal.fire({
    icon: "error",
    title: title,
    text: text,
    confirmButtonText: "Confirmed",
    confirmButtonColor: "#ef4444",
  });
}
