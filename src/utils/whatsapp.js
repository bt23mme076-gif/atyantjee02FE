export const WHATSAPP_NUMBER = '919579040183';

export function getInclusions(planId, planTitle) {
  const normalizedId = (planId || '').toLowerCase();
  const normalizedTitle = (planTitle || '').toLowerCase();

  if (
    normalizedId.includes('ultimate') ||
    normalizedTitle.includes('ultimate') ||
    normalizedTitle.includes('peace')
  ) {
    return [
      'Everything in Complete Round Support',
      'Personal 1-on-1 mentor',
      'Personalized preference review',
      'Final decision support calls',
      'Unlimited WhatsApp access',
      'Post-allotment transition guidance',
      'Bonus: Interview & Aptitude Guide',
      'Bonus: Extra mentor sessions (if needed)',
    ];
  }
  return [
    'Round-by-round JoSAA + CSAB support',
    'Dedicated mentor throughout',
    'Priority WhatsApp support',
    'Backup planning if allotment changes',
    'Support till final rounds',
    'Premium Advantage Pack included',
  ];
}

export function getWhatsAppLink(planName = '', customMessage = '') {
  let message = customMessage;

  if (!message) {
    message = `Hi Atyant, I need help with college and branch decision.\n`;
    if (planName) {
      message += `I am interested in the ${planName}.\n\n`;
    }
    message += `My exam:\n`;
    message += `My rank/percentile:\n`;
    message += `My preferred branch:\n`;
    message += `My main confusion:\n`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function getDetailedWhatsAppLink(booking) {
  if (!booking) return `https://wa.me/${WHATSAPP_NUMBER}`;

  const planTitle = booking.planTitle || 'Mentorship Package';
  const bookingId = booking._id || booking.id || 'N/A';
  const amount = booking.amount ? booking.amount / 100 : 'N/A';

  const inclusions = getInclusions(booking.planId, booking.planTitle);
  const inclusionsText = inclusions.map((item) => `• ${item}`).join('\n');

  let mentorText = '';
  if (booking.mentorId) {
    const m = booking.mentorId;
    mentorText = `*Selected Mentor:*\n• *Name:* ${m.name || 'N/A'}\n• *Phone:* ${m.phone || 'N/A'}\n• *College:* ${m.college || 'N/A'}\n• *Rank:* ${m.rank ? `AIR ${m.rank}` : 'N/A'}\n• *State:* ${m.state || 'N/A'}`;
  } else {
    mentorText = `*Selected Mentor:*\n• *Mentor:* Not assigned yet (Support will assign soon)`;
  }

  const message =
    `Hi Atyant, I have purchased the *${planTitle}* package!\n\n` +
    `*Booking Details:*\n` +
    `• *Booking ID:* ${bookingId}\n` +
    `• *Package:* ${planTitle} (₹${amount})\n\n` +
    `*My Details:*\n` +
    `• *Name:* ${booking.name || 'N/A'}\n` +
    `• *Phone:* ${booking.phone || 'N/A'}\n` +
    `• *Email:* ${booking.email || 'N/A'}\n\n` +
    `${mentorText}\n\n` +
    `*Package Inclusions:*\n` +
    `${inclusionsText}\n\n` +
    `Please help me schedule my session. Looking forward to getting my college decisions sorted!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
