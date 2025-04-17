import Swal from 'sweetalert2';

const showToast = (icon,title) => {
    const isDark = localStorage.getItem("theme") === "dark";
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: icon,
            title: title,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: isDark ? '#333' : '#fff',
            color: isDark ? '#fff' : '#000',        
            customClass: {
                popup: 'custom-swal-toast'
              }
        });
    }

export default showToast;