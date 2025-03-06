class DefaultRouter:
    """
    Un router para dirigir modelos específicos a 'db_imoee'.
    """

    route_app_labels = {'usuarios', 'conf_adm_lineas', 'conf_adm_procesos'}

    def db_for_read(self, model, **hints):
        """Determina la base de datos a usar para lectura."""
        if model._meta.app_label in self.route_app_labels:
            return 'default'  # Usa db_imoee
        return None

    def db_for_write(self, model, **hints):
        """Determina la base de datos a usar para escritura."""
        if model._meta.app_label in self.route_app_labels:
            return 'default'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """Permite relaciones entre modelos de diferentes bases de datos."""
        if (
            obj1._meta.app_label in self.route_app_labels or
            obj2._meta.app_label in self.route_app_labels
        ):
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """Determina si un modelo puede migrarse en una base de datos específica."""
        if app_label in self.route_app_labels:
            return db == 'default'
        return None


class IpcRouter:
    """
    Un router para dirigir modelos específicos a 'db_imoee_ipc'.
    """

    route_app_labels = {'otra_app_que_use_db_imoee_ipc'}  # Si alguna app usa esta BD

    def db_for_read(self, model, **hints):
        if model._meta.app_label in self.route_app_labels:
            return 'db_imoee_ipc'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label in self.route_app_labels:
            return 'db_imoee_ipc'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if (
            obj1._meta.app_label in self.route_app_labels or
            obj2._meta.app_label in self.route_app_labels
        ):
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label in self.route_app_labels:
            return db == 'db_imoee_ipc'
        return None
