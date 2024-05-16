export const calculateDays = (start: Date, end: Date) => {
  const startDate = new Date(start)
  const endDate = new Date(end)

  const diffInMs = endDate.getTime() - startDate.getTime()
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

  return Math.floor(diffInDays) + 1
}

export const formatDateTime = (input: Date | string) => {
  const date = new Date(input)

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // e.g., "Sat"
    month: 'short', // e.g., "Mar"
    day: 'numeric', // e.g., 31
    hour: 'numeric', // e.g., 1
    minute: 'numeric', // e.g., 45
    hour12: true
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    year: 'numeric', // e.g., 2024
    day: 'numeric'
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }

  const formattedDateTime = date.toLocaleString(undefined, dateTimeOptions)
  const formattedDate = date.toLocaleString(undefined, dateOptions)
  const formattedTime = date.toLocaleString(undefined, timeOptions)


  return {
    dateTime: formattedDateTime, // e.g., "Sat, Mar 25, 2:30 PM"
    dateOnly: formattedDate, // e.g., "Sat, Mar 25, 2024"
    timeOnly: formattedTime // e.g., "2:30 PM"
  }
}
