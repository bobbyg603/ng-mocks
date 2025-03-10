import { Component, forwardRef, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

@Component({
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TargetComponent),
    },
    {
      multi: true,
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TargetComponent),
    },
  ],
  selector: 'target-167',
  ['standalone' as never /* TODO: remove after upgrade to a14 */]:
    false,
  template: 'target',
})
class TargetComponent implements ControlValueAccessor, Validator {
  public valRegisterOnChange: any;
  public valRegisterOnTouched: any;
  public valRegisterOnValidatorChange: any;
  public valSetDisabledState: any;
  public valValidate: any;
  public valWriteValue: any;

  public registerOnChange(fn: any): void {
    this.valRegisterOnChange = [fn];
  }

  public registerOnTouched(fn: any): void {
    this.valRegisterOnTouched = [fn];
  }

  public registerOnValidatorChange(fn: any): void {
    this.valRegisterOnValidatorChange = [fn];
  }

  public setDisabledState(state: boolean): void {
    this.valSetDisabledState = [state];
  }

  public validate(): ValidationErrors {
    this.valValidate = [];

    return {
      mock: true,
    };
  }

  public writeValue(value: any): void {
    this.valWriteValue = [value];
  }
}

@Component({
  selector: 'app-root-167-component',
  ['standalone' as never /* TODO: remove after upgrade to a14 */]:
    false,
  template: '<target-167 [formControl]="control"></target-167>',
})
class RealComponent {
  public readonly control = new FormControl('mock');
}

@NgModule({
  declarations: [TargetComponent, RealComponent],
  exports: [RealComponent],
  imports: [ReactiveFormsModule],
})
class TargetModule {}

// NG_VALIDATORS and NG_VALUE_ACCESSOR should work together without an issue.
// material style of @Self() @Optional() ngControl?: NgControl does not work and throws
// Error: Circular dep for MockOfMyFormControlComponent
// @see https://github.com/help-me-mom/ng-mocks/issues/167
describe('issue-167:component:real', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [TargetModule],
    }).compileComponents(),
  );

  it('should create an instance', () => {
    const fixture = MockRender(RealComponent);

    const mock = ngMocks.find(
      fixture.debugElement,
      TargetComponent,
    ).componentInstance;
    ngMocks.stubMember(
      mock,
      'validate',
      typeof jest === 'undefined'
        ? jasmine.createSpy().and.returnValue({
            updated: true,
          })
        : jest.fn().mockReturnValue({
            updated: true,
          }),
    );
    ngMocks.stubMember(
      mock,
      'writeValue',
      typeof jest === 'undefined' ? jasmine.createSpy() : jest.fn(),
    );

    fixture.point.componentInstance.control.setValue('updated');
    expect(mock.validate).toHaveBeenCalled();
    expect(mock.writeValue).toHaveBeenCalledWith('updated');
    expect(fixture.point.componentInstance.control.errors).toEqual({
      updated: true,
    });
  });
});

// @see https://github.com/help-me-mom/ng-mocks/issues/167
describe('issue-167:component:mock', () => {
  beforeEach(() =>
    MockBuilder(RealComponent, TargetModule).keep(
      ReactiveFormsModule,
    ),
  );

  it('should create an instance', () => {
    const fixture = MockRender(RealComponent);

    const mock = ngMocks.find(
      fixture.debugElement,
      TargetComponent,
    ).componentInstance;
    ngMocks.stubMember(
      mock,
      'validate',
      typeof jest === 'undefined'
        ? jasmine.createSpy().and.returnValue({
            updated: true,
          })
        : jest.fn().mockReturnValue({
            updated: true,
          }),
    );
    ngMocks.stubMember(
      mock,
      'writeValue',
      typeof jest === 'undefined' ? jasmine.createSpy() : jest.fn(),
    );

    fixture.point.componentInstance.control.setValue('updated');
    expect(mock.validate).toHaveBeenCalled();
    expect(mock.writeValue).toHaveBeenCalledWith('updated');
    expect(fixture.point.componentInstance.control.errors).toEqual({
      updated: true,
    });
  });
});
