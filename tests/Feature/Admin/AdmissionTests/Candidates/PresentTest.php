<?php

namespace Tests\Feature\Admin\AdmissionTests\Candidates;

use App\Models\AdmissionTest;
use App\Models\AdmissionTestHasCandidate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PresentTest extends TestCase
{
    use RefreshDatabase;

    private $user;

    private $test;

    protected function setUp(): void
    {
        parent::setup();
        $this->user = User::factory()->create();
        $this->user->givePermissionTo(['Edit:Admission Test', 'View:User']);
        $this->test = AdmissionTest::factory()
            ->state([
                'testing_at' => now(),
                'expect_end_at' => now()->addHour(),
            ])->create();
        $this->test->candidates()->attach($this->user->id);
    }

    public function test_have_no_login()
    {
        $response = $this->putJson(
            route(
                'admin.admission-tests.candidates.present.update',
                [
                    'admission_test' => $this->test,
                    'candidate' => $this->user,
                ]
            ),
            ['status' => 1]
        );
        $response->assertUnauthorized();
    }

    public function test_have_no_edit_admission_test_permission_and_user_is_not_proctor()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('View:User');
        $response = $this->actingAs($user)->putJson(
            route(
                'admin.admission-tests.candidates.present.update',
                [
                    'admission_test' => $this->test,
                    'candidate' => $this->user,
                ]
            ),
            ['status' => 1]
        );
        $response->assertForbidden();
    }

    public function test_have_no_view_user_permission_and_user_is_not_proctor()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('Edit:Admission Test');
        $response = $this->actingAs($user)->putJson(
            route(
                'admin.admission-tests.candidates.present.update',
                [
                    'admission_test' => $this->test,
                    'candidate' => $this->user,
                ]
            ),
            ['status' => 1]
        );
        $response->assertForbidden();
    }

    public function test_admission_test_is_not_exist()
    {
        $response = $this->actingAs($this->user)->putJson(
            route(
                'admin.admission-tests.candidates.present.update',
                [
                    'admission_test' => 0,
                    'candidate' => $this->user,
                ]
            ),
            ['status' => 1]
        );
        $response->assertNotFound();
    }

    public function test_candidate_is_not_exists()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($this->user)->putJson(
            route(
                'admin.admission-tests.candidates.present.update',
                [
                    'admission_test' => $this->test,
                    'candidate' => $user,
                ]
            ),
            ['status' => 1]
        );
        $response->assertNotFound();
    }

    public function test_before_testing_at_more_than_2_hours()
    {
        $this->test->update(['testing_at' => now()->addHours(3)]);
        $response = $this->actingAs($this->user)
            ->putJson(
                route(
                    'admin.admission-tests.candidates.present.update',
                    [
                        'admission_test' => $this->test,
                        'candidate' => $this->user,
                    ]
                )
            );
        $response->assertConflict();
        $response->assertJson(['message' => 'Could not access before than testing time 2 hours.']);
    }

    public function test_after_than_expect_end_at_more_than_1_hour()
    {
        $this->test->update(['expect_end_at' => now()->subHour()->subSecond()]);
        $response = $this->actingAs($this->user)->putJson(
            route(
                'admin.admission-tests.candidates.present.update',
                [
                    'admission_test' => $this->test,
                    'candidate' => $this->user,
                ]
            ),
            ['status' => 1]
        );
        $response->assertGone();
        $response->assertJson(['message' => 'Could not access after than expect end time 1 hour.']);
    }

    public function test_candidate_result_exists()
    {
        $this->test->update([
            'testing_at' => now()->subHour()->subSecond(),
            'expect_end_at' => now()->subSecond(),
        ]);
        AdmissionTestHasCandidate::where('test_id', $this->test->id)
            ->where('user_id', $this->user->id)
            ->update([
                'is_present' => true,
                'is_pass' => true,
            ]);
        $response = $this->actingAs($this->user)->putJson(
            route(
                'admin.admission-tests.candidates.present.update',
                [
                    'admission_test' => $this->test,
                    'candidate' => $this->user,
                ]
            ),
            ['status' => 0]
        );
        $response->assertGone();
        $response->assertJson(['message' => 'Cannot change exists result candidate present status.']);
    }

    public function test_has_same_passport_already_qualification_of_membership()
    {
        $test = AdmissionTest::factory()->create();
        $user = User::factory()
            ->state([
                'passport_type_id' => $this->user->passport_type_id,
                'passport_number' => $this->user->passport_number,
            ])->create();
        $test->candidates()->attach($user->id, ['is_pass' => true]);
        $response = $this->actingAs($this->user)->putJson(
            route(
                'admin.admission-tests.candidates.present.update',
                [
                    'admission_test' => $this->test,
                    'candidate' => $this->user,
                ]
            ),
            ['status' => 1]
        );
        $response->assertConflict();
        $response->assertJson(['message' => 'The candidate has already been qualification for membership.']);
    }

    public function test_has_other_same_passport_user_account_tested()
    {
        $oldTest = AdmissionTest::factory()
            ->state([
                'testing_at' => $this->test->testing_at->subMonths($this->test->type->interval_month)->subDay(),
                'expect_end_at' => $this->test->expect_end_at->subMonths($this->test->type->interval_month)->subDay(),
            ])->create();
        $user = User::factory()
            ->state([
                'passport_type_id' => $this->user->passport_type_id,
                'passport_number' => $this->user->passport_number,
            ])->create();
        $oldTest->candidates()->attach($user->id, [
            'is_present' => 1,
            'is_pass' => 0,
        ]);
        $response = $this->actingAs($this->user)->putJson(
            route(
                'admin.admission-tests.candidates.present.update',
                [
                    'admission_test' => $this->test,
                    'candidate' => $this->user,
                ]
            ),
            ['status' => 1]
        );
        $response->assertConflict();
        $response->assertJson(['message' => 'The candidate has other same passport user account tested.']);
    }

    public function test_has_same_passport_tested_within_date_range()
    {
        $test = AdmissionTest::factory()
            ->state([
                'testing_at' => $this->test->testing_at->subMonths($this->test->type->interval_month)->addDay(),
                'expect_end_at' => $this->test->expect_end_at->subMonths($this->test->type->interval_month)->addDay(),
            ])->create();
        $test->candidates()->attach($this->user->id, ['is_present' => true]);
        $response = $this->actingAs($this->user)->putJson(
            route(
                'admin.admission-tests.candidates.present.update',
                [
                    'admission_test' => $this->test,
                    'candidate' => $this->user,
                ]
            ),
            ['status' => 1]
        );
        $response->assertConflict();
        $response->assertJson(['message' => "The candidate has admission test record within {$this->test->type->interval_month} months(count from testing at of this test sub {$this->test->type->interval_month} months to now)."]);
    }

    public function test_missing_status()
    {
        $response = $this->actingAs($this->user)->putJson(
            route(
                'admin.admission-tests.candidates.present.update',
                [
                    'admission_test' => $this->test,
                    'candidate' => $this->user,
                ]
            )
        );
        $response->assertInvalid(['status' => 'The status field is required. if you are using our CMS, please contact I.T. officer.']);
    }

    public function test_status_is_not_boolean()
    {
        $response = $this->actingAs($this->user)->putJson(
            route(
                'admin.admission-tests.candidates.present.update',
                [
                    'admission_test' => $this->test,
                    'candidate' => $this->user,
                ]
            ),
            ['status' => 'abc']
        );
        $response->assertInvalid(['status' => 'The status field must be true or false. if you are using our CMS, please contact I.T. officer.']);
    }

    public function test_happy_case()
    {
        $this->user = User::find($this->user->id);
        $response = $this->actingAs($this->user)->putJson(
            route(
                'admin.admission-tests.candidates.present.update',
                [
                    'admission_test' => $this->test,
                    'candidate' => $this->user,
                ]
            ),
            ['status' => true]
        );
        $response->assertSuccessful();
        $response->assertJson([
            'success' => "The candidate of {$this->user->adornedName} changed to be present.",
            'status' => true,
        ]);
    }
}
