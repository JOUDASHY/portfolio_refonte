import Swal from "sweetalert2";

export interface NotificationOptions {
  title: string;
  text: string;
  icon: "success" | "error" | "warning" | "info" | "question";
  confirmButtonText?: string;
}

export class NotificationService {
  static async showSuccess(options: Partial<NotificationOptions>) {
    return Swal.fire({
      title: options.title || "Bravo !",
      text: options.text,
      icon: "success",
      confirmButtonText: options.confirmButtonText || "OK",
      confirmButtonColor: "var(--accent)"
    });
  }

  static async showError(options: Partial<NotificationOptions>) {
    return Swal.fire({
      title: options.title || "Oops !",
      text: options.text,
      icon: "error",
      confirmButtonText: options.confirmButtonText || "OK",
      confirmButtonColor: "var(--accent)"
    });
  }

  static async showWarning(options: Partial<NotificationOptions>) {
    return Swal.fire({
      title: options.title || "Attention",
      text: options.text,
      icon: "warning",
      confirmButtonText: options.confirmButtonText || "OK",
      confirmButtonColor: "var(--accent)"
    });
  }

  static async showInfo(options: Partial<NotificationOptions>) {
    return Swal.fire({
      title: options.title || "Information",
      text: options.text,
      icon: "info",
      confirmButtonText: options.confirmButtonText || "OK",
      confirmButtonColor: "var(--accent)"
    });
  }

  static async confirm(options: Partial<NotificationOptions>) {
    return Swal.fire({
      title: options.title || "Confirmer",
      text: options.text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || "Oui",
      cancelButtonText: "Non",
      confirmButtonColor: "var(--accent)",
      cancelButtonColor: "#6c757d"
    });
  }

  // Lightweight toast notifications
  static async showSuccessToast(message: string) {
    return Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }

  static async showErrorToast(message: string) {
    return Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  }
}
