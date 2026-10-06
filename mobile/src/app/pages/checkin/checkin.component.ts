import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// 跟 server/app/brain.py 的 AREAS 保持一致
const AREAS = [
  '社交', '表達', '身心保養', '運動', '飲食', '潮流體驗', '知識吸收',
  '全球新知', '家人陪伴', '自我管理', '語言', '職涯', '其他',
] as const;

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.scss',
})
export class CheckinComponent {
  private readonly router = inject(Router);

  readonly areas = AREAS;
  readonly energyLevels = [1, 2, 3, 4, 5];

  energy = 3;
  picked = new Set<string>();
  note = '';

  goBack(): void {
    this.router.navigateByUrl('/chat');
  }

  toggleArea(area: string): void {
    if (this.picked.has(area)) {
      this.picked.delete(area);
    } else {
      this.picked.add(area);
    }
  }

  // TODO(API): 串接 POST /checkIn，帶 { energy, picked: [...picked], note }
  submit(): void {
    this.goBack();
  }
}
