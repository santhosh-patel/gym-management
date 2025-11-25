import requests
import sys

BASE_URL = "http://localhost:8000"

def run_test():
    print("Starting verification...")

    # 1. Create Plan
    print("Creating Plan...")
    plan_res = requests.post(f"{BASE_URL}/plans/", json={
        "name": "Test Plan",
        "price": 100,
        "duration_days": 30
    })
    if plan_res.status_code != 200:
        print(f"Failed to create plan: {plan_res.text}")
        return
    plan = plan_res.json()
    print(f"Plan created: {plan}")

    # 2. Create Member
    print("Creating Member...")
    member_res = requests.post(f"{BASE_URL}/members/", json={
        "name": "Test Member",
        "phone": "555-0199"
    })
    if member_res.status_code != 200:
        # Maybe already exists
        print(f"Member creation response: {member_res.text}")
        # Try to get existing
        members = requests.get(f"{BASE_URL}/members/").json()
        member = next((m for m in members if m['phone'] == "555-0199"), None)
    else:
        member = member_res.json()
    print(f"Member: {member}")

    # 3. Create Subscription
    print("Creating Subscription...")
    sub_res = requests.post(f"{BASE_URL}/subscriptions/", json={
        "member_id": member['id'],
        "plan_id": plan['id'],
        "start_date": "2023-01-01" # Past date to test active? No, let's use today
    })
    # Use today's date
    from datetime import datetime
    today = datetime.now().strftime("%Y-%m-%d")
    sub_res = requests.post(f"{BASE_URL}/subscriptions/", json={
        "member_id": member['id'],
        "plan_id": plan['id'],
        "start_date": today
    })
    
    if sub_res.status_code != 200:
        print(f"Failed to create subscription: {sub_res.text}")
        return
    print("Subscription created.")

    # 4. Check In
    print("Checking In...")
    checkin_res = requests.post(f"{BASE_URL}/attendance/check-in", json={
        "member_id": member['id']
    })
    if checkin_res.status_code != 200:
        print(f"Check-in failed: {checkin_res.text}")
        return
    print("Check-in successful.")

    # 5. Verify Trigger
    print("Verifying Trigger...")
    # Get member again
    member_updated = requests.get(f"{BASE_URL}/members/").json()
    target_member = next(m for m in member_updated if m['id'] == member['id'])
    print(f"Total Check-ins: {target_member['total_check_ins']}")
    
    if target_member['total_check_ins'] > member['total_check_ins']:
        print("SUCCESS: Trigger worked!")
    else:
        print("FAILURE: Trigger did not increment check-ins.")

    # 6. List Subscriptions
    print("Listing Subscriptions...")
    subs_res = requests.get(f"{BASE_URL}/subscriptions/")
    if subs_res.status_code != 200:
        print(f"Failed to list subscriptions: {subs_res.text}")
        return
    subs = subs_res.json()
    print(f"Found {len(subs)} subscriptions.")
    if len(subs) > 0:
        print("SUCCESS: Listed subscriptions.")

if __name__ == "__main__":
    try:
        run_test()
    except Exception as e:
        print(f"Error: {e}")
