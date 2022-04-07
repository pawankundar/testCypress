
describe("Job Processor test", () => {
  it("Sending payload to RabbitMq", () => {
    const payload = {
      "JOBID": "623954178eecaf7ef2ed8c93",
      "JOB_DATA_ID": "623954178eecaf7ef2ed8c94",
      "BLOCK_EXECUTION_PAYLOAD": {
        "jobId": "623954178eecaf7ef2ed8c93",
        "realtime": true,
        "jobDataId": "623954178eecaf7ef2ed8c94",
        "blockSequenceNumber": 1,
        "workflowId": "62344e6ce5b191707233205d",
      },
      "MAX_EXECUTION_TIME": 900,
    };
    cy.task("sendMessageToQueue", { message: JSON.stringify(payload)}).then(() => {
      cy.wait(10000)
      cy.task("getDataFromDb",{ collection : 'categories', filter : payload}).then(()=>{
      cy.fixture('responses').then((response)=>{
          expect(response.JOBID).to.equal(payload.JOBID);
        })
      })
    });
  });
});
