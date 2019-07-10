import { findMaxLength, transformMultDimArray, getMergeRanges, createHeadings, createWorksheet  } from 'dash-table/components/Button/ExportButton/utils';

describe('export', () => {
    describe('findMaxLength', () => {
        it('empty array', () => {
            const testedArray = [];
            const maxLength = findMaxLength(testedArray);
            expect(maxLength).to.equal(0);
        });
        it('array with only strings', () => {
            const testedArray = ['a', 'b', 'c', 'd'];
            const maxLength = findMaxLength(testedArray);
            expect(maxLength).to.equal(0);
        });
        it ('array with strings and strings array with same length', () => {
            const testedArray = ['a', ['b', 'c'], ['b', 'd']];
            const maxLength = findMaxLength(testedArray);
            expect(maxLength).to.equal(2);
        });
        it ('2D strings array', () => {
            const testedArray = [['a', 'b', 'c'], ['b', 'c', 'd'], ['b', 'd', 'a']];
            const maxLength = findMaxLength(testedArray);
            expect(maxLength).to.equal(3);
        });
        it ('multidimensional array', () => {
            const testedArray = [['a', 'b'], ['b', 'c', 'd'], ['a', 'b', 'd', 'a']];
            const maxLength = findMaxLength(testedArray);
            expect(maxLength).to.equal(4);
        });
        it ('multidimensional array with strings', () => {
            const testedArray = ['rows', ['a', 'b'], ['b', 'c', 'd'], ['a', 'b', 'd', 'a']];
            const maxLength = findMaxLength(testedArray);
            expect(maxLength).to.equal(4);
        });
    });

    describe('transformMultDimArray', () => {
        it('array with only strings', () => {
            const testedArray = [];
            const transformedArray = transformMultDimArray(testedArray, 0);
            const expectedArray = [];
            expect(transformedArray).to.deep.equal(expectedArray);
        });
        it('array with only strings', () => {
            const testedArray = ['a', 'b', 'c', 'd'];
            const transformedArray = transformMultDimArray(testedArray, 0);
            const expectedArray = [['a'], ['b'], ['c'], ['d']];
            expect(transformedArray).to.deep.equal(expectedArray);
        });
        it ('array with strings and strings array with same length', () => {
            const testedArray = ['a', ['b', 'c'], ['b', 'd']];
            const transformedArray = transformMultDimArray(testedArray, 2);
            const expectedArray = [['a', 'a'], ['b', 'c'], ['b', 'd']];
            expect(transformedArray).to.deep.equal(expectedArray);
        });
        it ('2D strings array', () => {
            const testedArray = [['a', 'b', 'c'], ['b', 'c', 'd'], ['b', 'd', 'a']];
            const transformedArray = transformMultDimArray(testedArray, 3);
            const expectedArray = [['a', 'b', 'c'], ['b', 'c', 'd'], ['b', 'd', 'a']];
            expect(transformedArray).to.deep.equal(expectedArray);

        });
        it ('multidimensional array', () => {
            const testedArray = [['a', 'b'], ['b', 'c', 'd'], ['a', 'b', 'd', 'a']];
            const transformedArray = transformMultDimArray(testedArray, 4);
            const expectedArray = [['a', 'b', '', ''], ['b', 'c', 'd', ''], ['a', 'b', 'd', 'a']];
            expect(transformedArray).to.deep.equal(expectedArray);

        });
        it ('multidimensional array with strings', () => {
            const testedArray = ['rows', ['a', 'b'], ['b', 'c', 'd'], ['a', 'b', 'd', 'a']];
            const transformedArray = transformMultDimArray(testedArray, 4);
            const expectedArray = [['rows', 'rows', 'rows', 'rows'], ['a', 'b', '', ''], ['b', 'c', 'd', ''], ['a', 'b', 'd', 'a']];
            expect(transformedArray).to.deep.equal(expectedArray);
        });
    });

    describe('getMergeRanges', () => {
        it('no merge', () => {
            const testedArray = [['a', 'b', 'c', 'd'],
                                 ['a', 'b', 'c', 'd'],
                                 ['a', 'b', 'c', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('duplicate values - no merge', () => {
            const testedArray = [['a', 'b', 'c', 'a'],
                                 ['a', 'b', 'c', 'a'],
                                 ['a', 'b', 'c', 'a']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('merge 2 cells right with a different value in between', () => {
            const testedArray = [['a', 'b', 'c', 'd'],
                                 ['a', 'b', 'a', 'a'],
                                 ['a', 'b', 'c', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [{s: {r: 1, c: 2}, e: {r: 1, c: 3}}];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('merge 2 cells left with a different value in between', () => {
            const testedArray = [['a', 'b', 'c', 'd'],
                                 ['a', 'a', 'b', 'a'],
                                 ['a', 'b', 'c', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [{s: {r: 1, c: 0}, e: {r: 1, c: 1}}];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('2 cells merge', () => {
            const testedArray = [['a', 'b', 'c', 'd'],
                                 ['a', 'a', 'c', 'd'],
                                 ['a', 'b', 'c', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [{s: {r: 1, c: 0}, e: {r: 1, c: 1}}];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('3 cells merge', () => {
            const testedArray = [['a', 'b', 'c', 'd'],
                                 ['a', 'a', 'a', 'd'],
                                 ['a', 'b', 'c', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [{s: {r: 1, c: 0}, e: {r: 1, c: 2}}];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('4 cells merge', () => {
            const testedArray = [['a', 'b', 'c', 'd'],
                                 ['a', 'a', 'a', 'a'],
                                 ['a', 'b', 'c', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [{s: {r: 1, c: 0}, e: {r: 1, c: 3}}];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('2 cells merge, 4 cells merge - same value', () => {
            const testedArray = [['a', 'a', 'c', 'd'],
                                 ['a', 'a', 'a', 'a'],
                                 ['a', 'b', 'c', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [
                {s: {r: 0, c: 0}, e: {r: 0, c: 1}},
                {s: {r: 1, c: 0}, e: {r: 1, c: 3}}
            ];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('2 cells merge, 4 cells merge, 3 cells merge - same value', () => {
            const testedArray = [['a', 'a', 'c', 'd'],
                                 ['a', 'a', 'a', 'a'],
                                 ['a', 'a', 'a', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [
                {s: {r: 0, c: 0}, e: {r: 0, c: 1}},
                {s: {r: 1, c: 0}, e: {r: 1, c: 3}},
                {s: {r: 2, c: 0}, e: {r: 2, c: 2}}
            ];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('table with same value', () => {
            const testedArray = [['a', 'a', 'a', 'a'],
                                 ['a', 'a', 'a', 'a'],
                                 ['a', 'a', 'a', 'a']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [
                {s: {r: 0, c: 0}, e: {r: 0, c: 3}},
                {s: {r: 1, c: 0}, e: {r: 1, c: 3}},
                {s: {r: 2, c: 0}, e: {r: 2, c: 3}}
            ];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
    });

    describe('createHeadings ', () => {
        it('strings 2D array input with same length for inner array', () => {
            const input = [['a', 'b', 'c'],
                           ['d', 'e', 'f'],
                           ['g', 'h', 'i']];
            const headings = createHeadings(input);
            const expectHeadings = [['a', 'd', 'g'],
                                    ['b', 'e', 'h'],
                                    ['c', 'f', 'i']];
            expect(headings).to.deep.equal(expectHeadings);
        });
        it('strings 2D array input with one different length for inner array', () => {
            const input = [['a', 'b', 'c'],
                           ['d', 'e', 'f'],
                           ['g', 'h', 'i', 'j']];
            const headings = createHeadings(input);
            const expectHeadings = [['a', 'd', 'g'],
                                    ['b', 'e', 'h'],
                                    ['c', 'f', 'i'],
                                    ['' , '', 'j']];
            expect(headings).to.deep.equal(expectHeadings);
        });
        it('strings 2D array input with multi different length for inner array', () => {
            const input = [['a', 'b', 'c'],
                           ['d', 'e', 'f', '1'],
                           ['g', 'h', 'i', 'j', 'k']];
            const headings = createHeadings(input);
            const expectHeadings = [['a', 'd', 'g'],
                                    ['b', 'e', 'h'],
                                    ['c', 'f', 'i'],
                                    ['' , '1', 'j'],
                                    ['', '', 'k']];
            expect(headings).to.deep.equal(expectHeadings);
        });
        it('strings and string[] array with same length for inner array', () => {
            const input = ['rows',
                           ['d', 'e', 'f'],
                           ['g', 'h', 'i']];
            const headings = createHeadings(input);
            const expectHeadings = [['rows', 'd', 'g'],
                                    ['rows', 'e', 'h'],
                                    ['rows', 'f', 'i']];
            expect(headings).to.deep.equal(expectHeadings);
        });
        it('strings and string[] array with different length for inner array', () => {
            const input = ['rows',
                          ['d', 'e', 'f', 'g'],
                          ['g', 'h', 'i']];
            const headings = createHeadings(input);
            const expectHeadings = [['rows', 'd', 'g'],
                                ['rows', 'e', 'h'],
                                ['rows', 'f', 'i'],
                                ['rows', 'g', '']];
            expect(headings).to.deep.equal(expectHeadings);
        });
        it('strings array', () => {
            const input = ['1',
                          '2',
                          '3'];
            const headings = createHeadings(input);
            const expectHeadings = [['1', '2', '3']];
            expect(headings).to.deep.equal(expectHeadings);
        });
        it('strings array', () => {
            const input = [];
            const headings = createHeadings(input);
            const expectHeadings = [];
            expect(headings).to.deep.equal(expectHeadings);
        });
    });

    describe('createWorksheet ', () => {
        const Headings = [['rows', 'a', 'b'],
                                ['rows', 'c', 'd'],
                                ['rows', 'e', 'f'],
                                ['rows', 'g', '']];
        const data = [
                {col1: 1, col2: 2, col3: 3},
                {col1: 2, col2: 3, col3: 4},
                {col1: 1, col2: 2, col3: 3}
            ];
        it('create xlsx sheet', () => {
            const columnID = ['col1', 'col2', 'col3'];
            const ws = createWorksheet(Headings, 'xlsx', data, columnID);
            const expectedWS = {
                A1: {t: 's', v: 'rows'},
                A2: {t: 's', v: 'rows'},
                A3: {t: 's', v: 'rows'},
                A4: {t: 's', v: 'rows'},
                A5: {t: 'n', v: 1},
                A6: {t: 'n', v: 2},
                A7: {t: 'n', v: 1},
                B1: {t: 's', v: 'a'},
                B2: {t: 's', v: 'c'},
                B3: {t: 's', v: 'e'},
                B4: {t: 's', v: 'g'},
                B5: {t: 'n', v: 2},
                B6: {t: 'n', v: 3},
                B7: {t: 'n', v: 2},
                C1: {t: 's', v: 'b'},
                C2: {t: 's', v: 'd'},
                C3: {t: 's', v: 'f'},
                C4: {t: 's', v: ''},
                C5: {t: 'n', v: 3},
                C6: {t: 'n', v: 4},
                C7: {t: 'n', v: 3}};
            expectedWS['!ref'] = 'A1:C7';
            expect(ws).to.deep.equal(expectedWS);
        });
        it('create csv sheet', () => {
            const columnID = ['col1', 'col2', 'col3'];
            const ws = createWorksheet(Headings, 'csv', data, columnID);
            const expectedWS = {
                A1: {t: 's', v: 'col1'},
                A2: {t: 'n', v: 1},
                A3: {t: 'n', v: 2},
                A4: {t: 'n', v: 1},
                B1: {t: 's', v: 'col2'},
                B2: {t: 'n', v: 2},
                B3: {t: 'n', v: 3},
                B4: {t: 'n', v: 2},
                C1: {t: 's', v: 'col3'},
                C2: {t: 'n', v: 3},
                C3: {t: 'n', v: 4},
                C4: {t: 'n', v: 3}};
            expectedWS['!ref'] = 'A1:C4';
            expect(ws).to.deep.equal(expectedWS);
        });
    });

});