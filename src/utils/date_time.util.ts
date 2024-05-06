import * as moment from 'moment';

/**
 * "Update a date with a string, and return a moment object."
 *
 * The function takes in a date, a string, and two numbers. The string is a time unit, like "1h" or
 * "2d". The two numbers are a default amount and a default unit of time
 * @param {Date} date - Date - the date to update
 * @param {string} updateTime - string - the time to update the date by.
 * @param {number} defaultUpdateAmount - number
 * @param defaultUpdateUnit - moment.unitOfTime.DurationConstructor
 * @param {'add' | 'subtract'} [operation=add] - 'add' | 'subtract' = 'add'
 * @returns A function that takes in a date, update time, default update amount, default update unit,
 * and an operation.
 */
export const updateDateTime = (
  date: Date,
  updateTime: string,
  defaultUpdateAmount: number,
  defaultUpdateUnit: moment.unitOfTime.DurationConstructor,
  operation: 'add' | 'subtract' = 'add',
): moment.Moment => {
  const mtDt = moment(date);

  const unitOfTime = updateTime?.split(/^\d+/)?.[1] || defaultUpdateUnit;
  const amount = Number(
    updateTime?.split(unitOfTime)[0] || defaultUpdateAmount,
  );
  // split update time
  let updateDt = mtDt[operation](
    amount,
    unitOfTime as moment.unitOfTime.DurationConstructor,
  );
  if (!updateDt.isValid())
    updateDt = mtDt[operation](defaultUpdateAmount, defaultUpdateUnit);

  return updateDt;
};

export const currDate = (value?: string | number | Date): Date => {
  return value ? new Date(value) : new Date();
};

export const toUTC = (date: Date): Date => moment.utc(date).toDate();

export const currentUnixTimestampSeconds = (): number =>
  Math.floor(Date.now() / 1000);
