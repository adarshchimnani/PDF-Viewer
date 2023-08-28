document.addEventListener('DOMContentLoaded', function() {
    const pdfContainer = document.getElementById('pdf-container');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNumSpan = document.getElementById('page-num');
    const goToPageInput = document.getElementById('go-to-page-input'); // Added input element
    const goToPageBtn = document.getElementById('go-to-page-btn'); // Added button element
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomInBtn = document.getElementById('zoom-in');
    const fileInput = document.getElementById('file-input');
  
    let pdfDoc = null;
    let pageNum = 1;
    let scale = 1.0;
  
    async function renderPage(num) {
      const page = await pdfDoc.getPage(num);
      const viewport = page.getViewport({ scale: scale });
  
      const canvas = document.createElement('canvas');
      const canvasContext = canvas.getContext('2d');
  
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      pdfContainer.innerHTML = '';
      pdfContainer.appendChild(canvas);
  
      const renderContext = {
        canvasContext,
        viewport,
      };
      await page.render(renderContext);
    }
  
    async function loadPDF(url) {
      const loadingTask = pdfjsLib.getDocument(url);
      pdfDoc = await loadingTask.promise;
      renderPage(pageNum);
      pageNumSpan.textContent = `Page ${pageNum} of ${pdfDoc.numPages}`;
    }
  
    prevPageBtn.addEventListener('click', () => {
      if (pageNum > 1) {
        pageNum--;
        renderPage(pageNum);
        pageNumSpan.textContent = `Page ${pageNum} of ${pdfDoc.numPages}`;
      }
    });
  
    nextPageBtn.addEventListener('click', () => {
      if (pageNum < pdfDoc.numPages) {
        pageNum++;
        renderPage(pageNum);
        pageNumSpan.textContent = `Page ${pageNum} of ${pdfDoc.numPages}`;
      }
    });
  
    goToPageBtn.addEventListener('click', () => { // Event listener for the "Go to Page" button
      const targetPage = parseInt(goToPageInput.value);
      if (targetPage >= 1 && targetPage <= pdfDoc.numPages) {
        pageNum = targetPage;
        renderPage(pageNum);
        pageNumSpan.textContent = `Page ${pageNum} of ${pdfDoc.numPages}`;
      }
    });
  
    zoomOutBtn.addEventListener('click', () => {
      if (scale > 0.25) {
        scale -= 0.25;
        renderPage(pageNum);
      }
    });
  
    zoomInBtn.addEventListener('click', () => {
      if (scale < 3) {
        scale += 0.25;
        renderPage(pageNum);
      }
    });
  
    fileInput.addEventListener('change', async (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        const fileURL = URL.createObjectURL(selectedFile);
        loadPDF(fileURL);
      }
    });
  
  });
  