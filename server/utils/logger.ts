import { createLogger, format } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const customFormat = format.combine(
  format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
  format.align(),
  format.printf(info => {
    const { timestamp, level, message } = info

    // Reformat the string to correctly indent multiline messages
    const indentSize = `${[timestamp]} - ${level.toUpperCase()}: `.length
    const formatedMessage = message.replace(/\n/g, `\n${' '.repeat(indentSize + 1)}`)

    return `${[timestamp]} - ${level.toUpperCase()}: ${formatedMessage}`
  }),
)

const transport = (filename: string): DailyRotateFile => {
  return new DailyRotateFile({
    filename,
    zippedArchive: true,
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    level: 'info',
    format: customFormat,
  })
}

export const authLogger = createLogger({
  transports: [transport('logs/auth/authLog-%DATE%.log')],
})

export const appLogger = createLogger({
  transports: [transport('logs/app/appLog-%DATE%.log')],
})
