<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'page_id',
        'name',
        'content',
    ];

    public function page()
    {
        return $this->belongsTo(SitePage::class, 'page_id');
    }
}
