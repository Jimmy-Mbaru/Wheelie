import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-availability-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-6 rounded-xl shadow">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Check Availability</h3>
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Location</label>
          <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option>Select Location</option>
            <option>Downtown</option>
            <option>Airport</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Date Range</label>
          <input type="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Check Availability
        </button>
      </form>
    </div>
  `
})
export class AvailabilityFormComponent {}