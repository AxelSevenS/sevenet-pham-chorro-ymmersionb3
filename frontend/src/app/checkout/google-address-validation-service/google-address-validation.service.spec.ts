import { TestBed } from '@angular/core/testing';

import { GoogleAddressValidationService } from './google-address-validation.service';

describe('GoogleAddressValidationService', () => {
	let service: GoogleAddressValidationService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(GoogleAddressValidationService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
