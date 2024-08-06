package com.gustasousagh.planning.model;

public class VoteMessage {
    private String sender;
    private int vote;
    private String sessionId;

    public VoteMessage() {
    }

    public VoteMessage(int vote, String sender, String sessionId) {
        this.vote = vote;
        this.sender = sender;
        this.sessionId = sessionId;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public int getVote() {
        return vote;
    }

    public void setVote(int vote) {
        this.vote = vote;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
