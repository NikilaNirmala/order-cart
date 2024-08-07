
document.getElementById('order-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevents the default form submission

  // Get form data
  const name = document.getElementById('name').value;

  // Generate a tracking number and delivery date for demonstration
  const trackingNumber = 'TRK' + Math.floor(Math.random() * 1000000);
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 days from now
  const formattedDate = deliveryDate.toLocaleDateString();

  // Display SweetAlert with the information
  Swal.fire({
    title: 'Order Submitted',
    html: `
        <strong>Name:</strong> ${name}<br>
        <strong>Tracking Number:</strong> ${trackingNumber}<br>
        <strong>Delivery Date:</strong> ${formattedDate}
    `,
    icon: 'success',
    confirmButtonText: 'OK'
  });

  // Optionally, you can clear the form fields here
  this.reset();
})
