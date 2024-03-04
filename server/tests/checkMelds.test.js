import { expect, test } from 'vitest'
import { checkMelds } from '../routes/games.router'

test('checks to see if 5, 5, 5, 5, 6, 6 returns 1500', () => {
    expect(checkMelds([
        { value: 5, locked: true, scored: false },
        { value: 5, locked: true, scored: false },
        { value: 5, locked: true, scored: false },
        { value: 5, locked: true, scored: false },
        { value: 6, locked: true, scored: false },
        { value: 6, locked: true, scored: false },
    ])).toBe(1500);
});

test('single one should return 100', () => {
    expect(checkMelds([
        { value: 1, locked: true, scored: false }
    ])).toBe(100);
});

test('single five should return 50', () => {
    expect(checkMelds([
        { value: 5, locked: true, scored: false }
    ])).toBe(50);
});

test('checks to see if 1, 1, 1 with locked true, true, true and scored false, false, false returns 300', () => {
    expect(checkMelds([{ value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }])).toBe(300);
});

test('checks to see if 2, 2, 2 with locked true, true, true and scored false, false, false returns 200', () => {
    expect(checkMelds([{ value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }])).toBe(200);
});

test('checks to see if 3, 3, 3 with locked true, true, true and scored false, false, false returns 300', () => {
    expect(checkMelds([{ value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }])).toBe(300);
});

test('checks to see if 4, 4, 4 with locked true, true, true and scored false, false, false returns 400', () => {
    expect(checkMelds([{ value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }])).toBe(400);
});

test('checks to see if 5, 5, 5 with locked true, true, true and scored false, false, false returns 500', () => {
    expect(checkMelds([{ value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }])).toBe(500);
});

test('checks to see if 6, 6, 6 with locked true, true, true and scored false, false, false returns 600', () => {
    expect(checkMelds([{ value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }])).toBe(600);
});

test('checks to see if 1, 1, 1, 1 with locked true, true, true, true and scored false, false, false, false returns 1000', () => {
    expect(checkMelds([{ value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }])).toBe(1000);
});

test('checks to see if 2, 2, 2, 2 with locked true, true, true, true and scored false, false, false, false returns 1000', () => {
    expect(checkMelds([{ value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }])).toBe(1000);
});

test('checks to see if 3, 3, 3, 3 with locked true, true, true, true and scored false, false, false, false returns 1000', () => {
    expect(checkMelds([{ value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }])).toBe(1000);
});

test('checks to see if 4, 4, 4, 4 with locked true, true, true, true and scored false, false, false, false returns 1000', () => {
    expect(checkMelds([{ value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }])).toBe(1000);
});

test('checks to see if 5, 5, 5, 5 with locked true, true, true, true and scored false, false, false, false returns 1000', () => {
    expect(checkMelds([{ value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }])).toBe(1000);
});

test('checks to see if 6, 6, 6, 6 with locked true, true, true, true and scored false, false, false, false returns 1000', () => {
    expect(checkMelds([{ value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }])).toBe(1000);
});

test('checks to see if 1, 1, 1, 1, 1 with locked true, true, true, true, true and scored false, false, false, false, false returns 2000', () => {
    expect(checkMelds([{ value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }])).toBe(2000);
});

test('checks to see if 2, 2, 2, 2, 2 with locked true, true, true, true, true and scored false, false, false, false, false returns 2000', () => {
    expect(checkMelds([{ value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }])).toBe(2000);
});

test('checks to see if 3, 3, 3, 3, 3 with locked true, true, true, true, true and scored false, false, false, false, false returns 2000', () => {
    expect(checkMelds([{ value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }])).toBe(2000);
});

test('checks to see if 4, 4, 4, 4, 4 with locked true, true, true, true, true and scored false, false, false, false, false returns 2000', () => {
    expect(checkMelds([{ value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }])).toBe(2000);
});

test('checks to see if 5, 5, 5, 5, 5 with locked true, true, true, true, true and scored false, false, false, false, false returns 2000', () => {
    expect(checkMelds([{ value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }])).toBe(2000);
});

test('checks to see if 6, 6, 6, 6, 6 with locked true, true, true, true, true and scored false, false, false, false, false returns 2000', () => {
    expect(checkMelds([{ value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }])).toBe(2000);
});

test('checks to see if 1, 1, 1, 1, 1, 1 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 3000', () => {
    expect(checkMelds([{ value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }])).toBe(3000);
});

test('checks to see if 2, 2, 2, 2, 2, 2 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 3000', () => {
    expect(checkMelds([{ value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }])).toBe(3000);
});

test('checks to see if 3, 3, 3, 3, 3, 3 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 3000', () => {
    expect(checkMelds([{ value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }])).toBe(3000);
});

test('checks to see if 4, 4, 4, 4, 4, 4 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 3000', () => {
    expect(checkMelds([{ value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }])).toBe(3000);
});

test('checks to see if 5, 5, 5, 5, 5, 5 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 3000', () => {
    expect(checkMelds([{ value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }])).toBe(3000);
});

test('checks to see if 6, 6, 6, 6, 6, 6 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 3000', () => {
    expect(checkMelds([{ value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }])).toBe(3000);
});

test('checks to see if 1, 2, 3, 4, 5, 6 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 1, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 6, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 2, 2, 3, 3, 4, 4 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 1, 1, 3, 3, 5, 5 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 2, 2, 5, 5, 6, 6 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 1, 1, 1, 1, 2, 2 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 1, 1, 1, 1, 3, 3 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 1, 1, 1, 1, 4, 4 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 1, 1, 1, 1, 5, 5 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 1, 1, 1, 1, 6, 6 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 2, 2, 2, 2, 1, 1 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 2, 2, 2, 2, 3, 3 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 2, 2, 2, 2, 4, 4 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 2, 2, 2, 2, 5, 5 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 2, 2, 2, 2, 6, 6 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 3, 3, 3, 3, 1, 1 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 3, 3, 3, 3, 2, 2 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 3, 3, 3, 3, 4, 4 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 3, 3, 3, 3, 5, 5 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 3, 3, 3, 3, 6, 6 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 4, 4, 4, 4, 1, 1 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 4, 4, 4, 4, 2, 2 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 4, 4, 4, 4, 3, 3 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 3, locked: true, scored: false }, { value: 3, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 4, 4, 4, 4, 5, 5 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 4, 4, 4, 4, 6, 6 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 4, locked: true, scored: false }, { value: 6, locked: true, scored: false }, { value: 6, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 5, 5, 5, 5, 1, 1 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 1, locked: true, scored: false }, { value: 1, locked: true, scored: false }])).toBe(1500);
});

test('checks to see if 5, 5, 5, 5, 2, 2 with locked true, true, true, true, true, true and scored false, false, false, false, false, false returns 1500', () => {
    expect(checkMelds([{ value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 5, locked: true, scored: false }, { value: 2, locked: true, scored: false }, { value: 2, locked: true, scored: false }])).toBe(1500);
});

