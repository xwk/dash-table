import DashTable from 'cypress/DashTable';
import Key from 'cypress/Key';

import { AppMode, ReadWriteModes } from 'demo/AppMode';

Object.values(ReadWriteModes).forEach(mode => {
    describe(`edit, mode=${mode}`, () => {
        beforeEach(() => {
            cy.visit(`http://localhost:8080?mode=${mode}`);
            DashTable.toggleScroll(false);
        });

        it('can delete dropdown', () => {
            DashTable.getCell(0, 6).trigger('mouseover', { force: true });
            DashTable.getCell(0, 6).within(() => cy.get('.Select-clear').click({ force : true }));
            DashTable.getCell(0, 6).within(() => cy.get('.Select-placeholder').should('exist'));
        });

        it('can delete dropdown and set value', () => {
            DashTable.getCell(0, 6).trigger('mouseover', { force: true });
            DashTable.getCell(0, 6).within(() => cy.get('.Select-clear').click({ force: true }));
            DashTable.getCell(0, 6).within(() => cy.get('.Select-placeholder').should('exist'));

            DashTable.getCell(0, 6).within(() => cy.get('.Select-arrow').click({ force: true })).then(() => {
                DashTable.getCell(0, 6).within(() => {
                    cy.get('.Select-option').then($options => {
                        const target = $options[0];
                        if (target) {
                            cy.wrap(target).click({ force: true });
                        }
                    });
                });
            });

            DashTable.getCell(0, 6).within(() => cy.get('.Select-placeholder').should('not.exist'));
        });

        it('can edit dropdown', () => {
            let initialValue: string;
            let expectedValue: string;

            DashTable.getCell(0, 6).within(() => {
                cy.get('.Select-value-label').then($valueLabel => {
                    initialValue = $valueLabel[0].innerHTML;
                    cy.log('initial value', initialValue);
                });
            });

            DashTable.getCell(0, 6).within(() => cy.get('.Select-arrow').click());

            DashTable.getCell(0, 6).within(() => {
                cy.get('.Select-option').then($options => {
                    const target = Array.from($options).find($option => $option.innerHTML !== initialValue);
                    if (target) {
                        cy.wrap(target).click({ force: true });

                        expectedValue = target.innerHTML;
                        cy.log('expected value', expectedValue);
                    }
                });
            });

            DashTable.getCell(0, 6).within(() => {
                cy.get('.Select-value-label').should('have.html', expectedValue);
            });
        });
    });
});

describe(`edit, mode=${AppMode.Typed}`, () => {
    beforeEach(() => {
        cy.visit(`http://localhost:8080?mode=${AppMode.Typed}`);
        DashTable.toggleScroll(false);
    });

    it('can edit number cell with a number string', () => {
        DashTable.clickCellById(0, 'ccc');
        DashTable.focusedType(`123${Key.Enter}`);
        DashTable.getCellById(0, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', `123`));
    });

    it('cannot edit number cell with a non-number string', () => {
        DashTable.clickCellById(0, 'ccc');
        DashTable.focusedType(`abc${Key.Enter}`);
        DashTable.getCellById(0, 'ccc').within(() => cy.get('.dash-cell-value').should('not.have.html', `abc`));
    });

    describe('copy/paste', () => {
        describe('string into a number', () => {
            let copiedValue;

            beforeEach(() => {
                DashTable.getCellById(0, 'bbb-readonly').within(
                    () => cy.get('.dash-cell-value').then($cells => copiedValue = $cells[0].innerHTML)
                );

                DashTable.clickCellById(0, 'bbb-readonly');
                DashTable.focusedType(`${Key.Meta}c`);
            });

            it('does nothing', () => {
                DashTable.clickCellById(0, 'ccc');
                DashTable.focusedType(`${Key.Meta}v`);
                DashTable.getCellById(0, 'ccc').within(
                    () => cy.get('.dash-cell-value').should('not.have.value', copiedValue)
                );
            });
        });

        describe('number into a number', () => {
            let copiedValue;

            beforeEach(() => {
                DashTable.getCellById(0, 'ddd').within(
                    () => cy.get('.dash-cell-value').then($cells => copiedValue = $cells[0].innerHTML)
                );

                DashTable.clickCellById(0, 'ddd');
                DashTable.focusedType(`${Key.Meta}c`);
            });

            it('copies value', () => {
                DashTable.clickCellById(0, 'ccc');
                DashTable.focusedType(`${Key.Meta}v`);
                DashTable.getCellById(0, 'ccc').within(
                    () => cy.get('.dash-cell-value').should('have.value', copiedValue)
                );
            });
        });
    });
});

describe(`edit, mode=${AppMode.Date}`, () => {
    beforeEach(() => {
        cy.visit(`http://localhost:8080?mode=${AppMode.Date}`);
        DashTable.toggleScroll(false);
    });

    it('can edit date cell with a date string', () => {
        DashTable.clickCellById(0, 'ccc');
        DashTable.focusedType(`17-8-21${Key.Enter}`);
        DashTable.getCellById(0, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', `2017-08-21`));
    });

    it('cannot edit date cell with a non-date string', () => {
        DashTable.clickCellById(0, 'ccc');
        DashTable.focusedType(`abc${Key.Enter}`);
        DashTable.getCellById(0, 'ccc').within(() => cy.get('.dash-cell-value').should('not.have.html', `abc`));
    });

    describe('copy/paste', () => {
        describe('string into a date', () => {
            let copiedValue;

            beforeEach(() => {
                DashTable.getCellById(0, 'bbb-readonly').within(
                    () => cy.get('.dash-cell-value').then($cells => copiedValue = $cells[0].innerHTML)
                );

                DashTable.clickCellById(0, 'bbb-readonly');
                DashTable.focusedType(`${Key.Meta}c`);
            });

            it('does nothing', () => {
                DashTable.clickCellById(0, 'ccc');
                DashTable.focusedType(`${Key.Meta}v`);
                DashTable.getCellById(0, 'ccc').within(
                    () => cy.get('.dash-cell-value').should('not.have.value', copiedValue)
                );
            });
        });

        describe('date into a date', () => {
            let copiedValue;

            beforeEach(() => {
                DashTable.getCellById(0, 'ddd').within(
                    () => cy.get('.dash-cell-value').then($cells => copiedValue = $cells[0].innerHTML)
                );

                DashTable.clickCellById(0, 'ddd');
                DashTable.focusedType(`${Key.Meta}c`);
            });

            it('copies value', () => {
                DashTable.clickCellById(0, 'ccc');
                DashTable.focusedType(`${Key.Meta}v`);
                DashTable.getCellById(0, 'ccc').within(
                    () => cy.get('.dash-cell-value').should('have.value', copiedValue)
                );
            });
        });
    });
});
