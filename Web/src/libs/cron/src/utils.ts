/* eslint-disable */
import { Classes } from './types';

/**
 * Creates an array of integers from start to end, inclusive
 */
export function range(start: number, end: number) {
  const array = [];

  for (let i = start; i <= end; i++) {
    array.push(i);
  }

  return array;
}

/**
 * Sorts an array of numbers
 */
export function sort(array: number[]) {
  array.sort(function (a, b) {
    return a - b;
  });

  return array;
}

/**
 * Removes duplicate entries from an array
 */
export function dedup(array: number[]) {
  const result: number[] = [];

  array.forEach(function (i) {
    if (result.indexOf(i) < 0) {
      result.push(i);
    }
  });

  return result;
}

/**
 * Simple classNames util function to prevent adding external library 'classnames'
 */
export function classNames(classes: Classes) {
  return Object.entries(classes)
    .filter(([key, value]) => key && value)
    .map(([key]) => key)
    .join(' ');
}
