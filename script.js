// DOM Elements
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const qrisImage = document.getElementById('qrisImage');
const toast = document.getElementById('toast');
const qrisModal = document.getElementById('qrisModal');
const closeModal = document.getElementById('closeModal');
const scrollIndicator = document.querySelector('.scroll-indicator');

// QRIS URL dari yang diberikan
const QRIS_URL = "https://image2url.com/r2/default/images/1770275791720-bfeed500-7584-471f-b7d8-8975534de1c8.png";

// Download QRIS Function - Langsung download file asli
downloadBtn.addEventListener('click', async function() {
    try {
        // Menampilkan pesan sedang memproses
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        downloadBtn.disabled = true;
        
        // Nama file untuk download
        const fileName = `QRIS_LIVIAA_AESTHETIC_${new Date().getTime()}.png`;
        
        // Method 1: Fetch dan download (lebih handal)
        const response = await fetch(QRIS_URL + '?t=' + new Date().getTime());
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        // Membuat elemen link untuk download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.style.display = 'none';
        
        // Menambahkan ke dokumen dan mengklik
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        }, 100);
        
        // Tampilkan notifikasi sukses
        showToast('QRIS berhasil didownload!');
        
    } catch (error) {
        console.error('Download error:', error);
        
        // Fallback method: Direct download link
        try {
            const fallbackLink = document.createElement('a');
            fallbackLink.href = QRIS_URL;
            fallbackLink.download = `QRIS_LIVIAA_AESTHETIC_${new Date().getTime()}.png`;
            fallbackLink.target = '_blank';
            document.body.appendChild(fallbackLink);
            fallbackLink.click();
            document.body.removeChild(fallbackLink);
            
            showToast('QRIS dibuka untuk download!');
        } catch (fallbackError) {
            console.error('Fallback error:', fallbackError);
            showToast('Gagal mendownload. Coba klik kanan gambar dan "Save Image As"');
        }
    } finally {
        // Kembalikan tombol ke state semula
        setTimeout(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
        }, 1500);
    }
});

// Share QRIS Function
shareBtn.addEventListener('click', function() {
    const shareData = {
        title: 'QRIS LIVIAA AESTHETIC',
        text: `Gunakan QRIS ini untuk pembayaran di LIVIAA AESTHETIC
NMIID: ID1025459289092
Verifikasi: www.aspi-qris.id`,
        url: window.location.href,
    };
    
    if (navigator.share && navigator.canShare(shareData)) {
        // Use Web Share API if available
        navigator.share(shareData)
        .then(() => showToast('QRIS berhasil dibagikan!'))
        .catch((error) => {
            console.log('Error sharing:', error);
            copyToClipboard();
        });
    } else {
        // Fallback: Copy URL to clipboard
        copyToClipboard();
    }
});

// Function to copy URL to clipboard
function copyToClipboard() {
    const currentUrl = window.location.href;
    
    navigator.clipboard.writeText(currentUrl)
        .then(() => showToast('Link berhasil disalin ke clipboard!'))
        .catch(err => {
            console.error('Failed to copy: ', err);
            
            // Fallback manual copy
            const textArea = document.createElement('textarea');
            textArea.value = currentUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            showToast('Link berhasil disalin!');
        });
}

// Toast Notification Function
function showToast(message) {
    const toastMessage = toast.querySelector('.toast-message');
    toastMessage.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Modal Functions
function openModal() {
    qrisModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModalFunc() {
    qrisModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event Listeners for Modal
qrisImage.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFunc);

// Close modal when clicking outside
qrisModal.addEventListener('click', function(e) {
    if (e.target === qrisModal) {
        closeModalFunc();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && qrisModal.classList.contains('active')) {
        closeModalFunc();
    }
});

// Scroll Functions
scrollIndicator.addEventListener('click', function() {
    document.getElementById('qris').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
});

// Hide scroll indicator when user scrolls
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.transition = 'opacity 0.5s ease';
    } else {
        scrollIndicator.style.opacity = '1';
    }
    
    // Add animation to QRIS section when it comes into view
    const qrisSection = document.getElementById('qris');
    const sectionPosition = qrisSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (sectionPosition < screenPosition) {
        qrisSection.style.opacity = '1';
        qrisSection.style.transform = 'translateY(0)';
    }
});

// Initialize QRIS section with hidden state
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi gambar QRIS dengan URL yang diberikan
    qrisImage.src = QRIS_URL;
    
    // Set atribut untuk aksesibilitas
    qrisImage.setAttribute('aria-label', 'QRIS Code LIVIAA AESTHETIC - Ukuran besar untuk mudah di-scan');
    
    // Inisialisasi section dengan animasi
    const qrisSection = document.getElementById('qris');
    qrisSection.style.opacity = '0';
    qrisSection.style.transform = 'translateY(30px)';
    qrisSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    // Preload gambar untuk performa lebih baik
    const preloadImage = new Image();
    preloadImage.src = QRIS_URL;
    
    // Tambahkan class untuk animasi saat gambar selesai dimuat
    qrisImage.addEventListener('load', function() {
        this.classList.add('loaded');
        console.log('QRIS berhasil dimuat dengan ukuran besar');
    });
});

// Add image loading fallback
qrisImage.addEventListener('error', function() {
    console.log('Gambar QRIS tidak dapat dimuat, menggunakan fallback QR generator');
    
    // Fallback ke QR code generator jika gambar utama gagal
    const qrData = encodeURIComponent(
        "LIVIAA AESTHETIC\n" +
        "NMIID: ID1025459289092\n" +
        "https://www.aspi-qris.id\n" +
        "Dicetak oleh: 93600914\n" +
        "Versi cetak: V0.0.2025.11.29\n" +
        "QRIS Ukuran Besar"
    );
    
    const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${qrData}&color=ff1a75&bgcolor=fff5f9&format=png&qzone=2`;
    
    qrisImage.src = fallbackUrl;
    qrisImage.alt = 'QRIS Fallback - Ukuran besar untuk mudah scanning';
    
    // Update modal image juga
    document.querySelector('.modal-qris').src = fallbackUrl;
    
    // Update download function untuk fallback
    downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const link = document.createElement('a');
        link.href = fallbackUrl;
        link.download = `QRIS_LIVIAA_AESTHETIC_Fallback_${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('QRIS fallback berhasil didownload!');
    });
});
