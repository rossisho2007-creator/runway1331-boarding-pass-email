/**
 * STAFF ALERT SYSTEM
 * Runway1331 - Alerts for lost guests
 * Contact: rsvn@runway1331.com.hk / +852 5635 7131
 */

class StaffAlertService {
    
    constructor(config) {
        config = config || {};
        this.alertEmail = config.alertEmail || 'rsvn@runway1331.com.hk';
        this.alertPhone = config.alertPhone || '+852 5635 7131';
        this.alertHistory = [];
    }

    createLostGuestAlert(guest) {
        
        var alert = {
            id: 'ALERT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
            type: 'LOST_GUEST',
            priority: 'HIGH',
            timestamp: new Date().toISOString(),
            guest: {
                name: guest.name,
                buildingNumber: guest.buildingNumber,
                roomCode: guest.roomCode || 'Unknown',
                group: guest.group,
                compass: guest.compass,
                lastKnownLocation: guest.lastKnownLocation || 'Unknown'
            },
            message: this.formatAlertMessage(guest),
            status: 'PENDING',
            acknowledged: false
        };
        
        this.alertHistory.push(alert);
        this.logAlert(alert);
        
        return alert;
    }

    formatAlertMessage(guest) {
        return [
            'LOST GUEST ALERT - Runway1331',
            'Guest: ' + guest.name,
            'Building: ' + guest.buildingNumber + ' - ' + (guest.roomCode || 'Unknown'),
            'Group: ' + guest.group + ' (' + guest.compass + ')',
            'Last seen: ' + (guest.lastKnownLocation || 'Unknown'),
            '',
            'ACTION: Guest needs help finding their room.',
            'If you are the only staff on duty, contact guest at their phone or ask them to return to reception.',
            '',
            'Contact: rsvn@runway1331.com.hk | +852 5635 7131'
        ].join('\n');
    }

    logAlert(alert) {
        console.log('========================================');
        console.log(alert.message);
        console.log('Alert ID: ' + alert.id);
        console.log('Time: ' + alert.timestamp);
        console.log('========================================\n');
    }

    getPendingAlerts() {
        return this.alertHistory.filter(function(a) {
            return a.status === 'PENDING';
        });
    }

    acknowledgeAlert(alertId) {
        var alert = this.alertHistory.find(function(a) {
            return a.id === alertId;
        });
        if (alert) {
            alert.acknowledged = true;
            alert.status = 'ACKNOWLEDGED';
            alert.acknowledgedAt = new Date().toISOString();
        }
        return alert;
    }

    resolveAlert(alertId) {
        var alert = this.alertHistory.find(function(a) {
            return a.id === alertId;
        });
        if (alert) {
            alert.status = 'RESOLVED';
            alert.resolvedAt = new Date().toISOString();
        }
        return alert;
    }
}

module.exports = StaffAlertService;
