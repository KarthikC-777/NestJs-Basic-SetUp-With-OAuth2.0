import { logger } from '../config/logger';

export function checkCodeRabbitEfficiency(
  a: number,
  b: number,
  c: number,
): void {
  if (a > b) {
    if (a > c) {
      logger.log(`number ${a} is bigger`);
    } else {
      logger.log(`number ${c} is bigger`);
    }
  } else {
    if (b > c) {
      logger.log(`number ${b} is bigger`);
    } else {
      logger.log(`number ${c} is bigger`);
    }
  }
}
