import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { filter, interval, startWith } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  private readonly swUpdate = inject(SwUpdate);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.listenForUpdates();
    this.scheduleUpdateChecks();
  }

  private listenForUpdates(): void {
    this.swUpdate.versionUpdates
      .pipe(
        filter((event: VersionEvent) => event.type === 'VERSION_READY'),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        void this.activateAndReload();
      });

    this.swUpdate.unrecoverable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      globalThis.location.reload();
    });
  }

  private scheduleUpdateChecks(): void {
    interval(6 * 60 * 60 * 1000)
      .pipe(startWith(0), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.swUpdate.checkForUpdate();
      });
  }

  private async activateAndReload(): Promise<void> {
    try {
      await this.swUpdate.activateUpdate();
    } finally {
      globalThis.location.reload();
    }
  }
}
