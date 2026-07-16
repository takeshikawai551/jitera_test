from datetime import datetime
import requests
def generate_request_id() -> str:
    dt_now = datetime.now()
    request_id = (
        str(dt_now.year)
        + str(dt_now.month).zfill(2)
        + str(dt_now.day).zfill(2)
        + str(dt_now.hour).zfill(2)
        + str(dt_now.minute).zfill(2)
        + str(dt_now.second).zfill(2)
        + str(dt_now.microsecond).zfill(6) 
    )
    return request_id

def post_go_somewhere_request(app_logger, url, robot_id, dest_cell_code):
    headers = {'Content-Type': 'application/json'}
    requestId = generate_request_id()
    postData = {
        "id": "clientid",
        "msgType": "RobotTaskRequestMsg",
        "request": {
            "header": {
                "clientCode": "geekplus",
                "warehouseCode": "*",
                "userId": "geekplus",
                "userKey": "111111",
                "version": "3.3.0",
                "requestId": requestId
            },
            "body": {
                "robotId": robot_id,
                "instruction": "GO_NEXT",
                "taskType": "GO_SOMEWHERE_TO_STAY",
                "destCellCode": dest_cell_code,
                "isContinue": 0
            }
        }
    }

    try:
        # app_logger.info(f"POST request to {url} with data: {postData}")
        response = requests.post(url, json=postData, headers=headers)
        # app_logger.info(f"Response status: {response.status_code}, body: {response.text}")
        return response
    except Exception as e:
        # app_logger.error(f"例外発生 robotId={robot_id}: {e}", exc_info=True)
        raise


def main():
    post_go_somewhere_request(
        app_logger=None,
        url="http://161.95.4.222:8895",
        robot_id="9990001",
        dest_cell_code="0503"
    )


if __name__ == '__main__':
    main()