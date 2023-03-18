export function getCurrentPaymentDate(day: number): Date {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  return new Date(`${currentMonth}/${day}/${currentYear}`);
}
