<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repository\Auth;
use App\Repository\AuthInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(AuthInterface::class, Auth::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
