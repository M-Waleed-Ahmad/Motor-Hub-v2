<?php

namespace App\Http\Controllers;

use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PasswordResetMail extends Controller
{
    use Queueable, SerializesModels;

    public $resetToken;

    public function __construct($resetToken)
    {
        $this->resetToken = $resetToken;
    }

    public function build()
    {
        return $this->view('emails.password_reset')
                    ->with(['resetToken' => $this->resetToken]);
    }
}
