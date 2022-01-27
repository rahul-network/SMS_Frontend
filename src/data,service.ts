import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

import { RegionData } from '../src/app/form/mct/region-data.service';

@Injectable()
export class AppData implements InMemoryDbService {

  createDb() {
    return {
      regions: RegionData.regions
    };
  }
}