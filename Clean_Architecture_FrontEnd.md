# Clean Architecture: Estándar para Desarrollo Front-End Escalable y Mantenible

## Notas de versión

| Versión | Cambios                                                                                                                                                                                                                                                                   |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **v1**  | Estándar original: principios de Clean Architecture con una única estructura de carpetas (`core/data/infrastructure/presentation/shared`) orientada a Angular 16. Ejemplos con inyección por constructor y `Promise`.                                                     |
| **v2**  | Incorpora **dos directrices estructurales** (layer-first y feature-first) con criterios de elección según el tamaño y escala del proyecto. Ejemplos actualizados a Angular 20+: componentes standalone, `inject()`, signals, `Observable` y registro de providers con DI. |

---

## Introducción

Este documento presenta una propuesta detallada para implementar los principios de Clean Architecture en el desarrollo de aplicaciones front-end. Nuestro objetivo es establecer un estándar arquitectónico que sea aplicable a diversos frameworks y bibliotecas de desarrollo web moderno, proporcionando una base sólida, escalable y mantenible para proyectos de front-end.

> _Diagrama: círculos concéntrados de Clean Architecture — Entities (Enterprise Business Rules) → Use Cases (Application Business Rules) → Controllers / Gateways / Presenters (Interface Adapters) → Devices, Web, UI, DB, External Interfaces (Frameworks & Drivers)._

Los principios que definen el estándar (separación de responsabilidades, independencia de frameworks, dependencias hacia adentro) son **comunes a todos los proyectos**. Lo que sí cambia según el proyecto es **la forma de organizar las carpetas**: este documento define dos directrices estructurales —_layer-first_ y _feature-first_— y establece criterios objetivos para elegir una u otra en el arranque de cada proyecto.

---

## Objetivos

### 1. Separación de Responsabilidades

Clean Architecture se basa en la idea de separar la lógica de negocio central de la lógica de presentación y de infraestructura. Esto permite que la lógica de negocio sea independiente de los cambios en la UI, bases de datos, o tecnología subyacente.

### 2. Independencia del Framework

En un caso ideal, la capa de Dominio debe ser completamente agnóstica al framework utilizado, permitiendo que sea fácilmente adaptable si se cambia el framework (e.g., de Angular a React).

### 3. Mantenibilidad y Testabilidad

Al organizar el código de manera modular y separada, se facilita la comprensión y modificación del código a lo largo del tiempo. Además, esta estructura permite la escritura de pruebas unitarias e integradas de manera efectiva.

### 4. Escalabilidad y Reutilización

Proporciona una estructura que permite el crecimiento del proyecto sin comprometer su integridad, maximizando la reutilización de componentes y lógica de negocio.

---

## Principios fundamentales

- **Clean Architecture:** Separar las preocupaciones del negocio de los detalles de implementación.
- **SOLID:** Aplicar los principios de Responsabilidad Única, Abierto/Cerrado, Sustitución de Liskov, Segregación de Interfaces e Inversión de Dependencias.
- **DRY (Don't Repeat Yourself):** Evitar la duplicación de código y lógica.
- **KISS (Keep It Simple, Stupid):** Mantener la simplicidad en el diseño y la implementación.

Estos principios aplican **por igual en ambas directrices estructurales**. La elección de la estructura de carpetas no cambia las reglas de dependencia: el dominio nunca depende de la presentación, la presentación depende de los casos de uso, y la infraestructura depende de las interfaces definidas en el dominio (Inversión de Dependencias).

---

## Directrices estructurales según el proyecto

La estructura de carpetas es esencial para implementar Clean Architecture de manera efectiva. Este estándar define **dos directrices** que comparten los mismos principios y capas, difierenendo en el **eje de organización**:

- **Directriz A — Layer-first:** agrupa el código por capa técnica, globalmente en la aplicación.
- **Directriz B — Feature-first:** agrupa el código por feature/módulo de negocio; cada feature contiene sus propias capas.

### Directriz A — Layer-first

Organiza el código en carpetas globales por capa técnica. Todas las features comparten las mismas carpetas `core/`, `data/`, `presentation/`.

**Ideal para:** proyectos pequeños o medianos, prototipos, MVPs, equipos de 1-2 desarrolladores y pocas features (1-5).

### Directriz B — Feature-first

Organiza el código en carpetas por feature/módulo de negocio. Cada feature es un módulo vertical e independiente que contiene sus cuatro capas completas (`domain`, `application`, `infrastructure`, `presentation`). Las preocupaciones transversales (auth, interceptores, guards, estado global) viven en una carpeta `core/` compartida.

**Ideal para:** proyectos grandes y escalables, aplicaciones multi-módulo, varios equipos o squads trabajando en paralelo, y un número ilimitado de features.

### Cómo elegir directriz

La elección es una **decisión de kickoff del proyecto** y debe quedar registrada en la documentación del repositorio antes de escribir el primer componente. No se recomienda mezclar ambas estructuras en el mismo proyecto.

| Criterio                     | Directriz A — Layer-first                           | Directriz B — Feature-first            |
| ---------------------------- | --------------------------------------------------- | -------------------------------------- |
| Tamaño del proyecto          | Pequeño / mediano                                   | Grande / multi-módulo                  |
| Equipo                       | 1-2 desarrolladores                                 | Varios equipos o squads                |
| Cantidad de features         | 1-5                                                 | Ilimitado                              |
| Ciclo de vida típico         | Prototipo, MVP, herramienta interna                 | Producto a largo plazo                 |
| Tests                        | Dispersos por carpeta de capa                       | Colocalizados junto a su feature       |
| Riesgo al escalar            | Las carpetas de capa crecen hasta volverse confusas | Cada feature permanece aislada         |
| Reutilización entre features | Natural (todo vive en `core/` y `data/`)            | Requiere extraer a `shared/` o `core/` |

**Regla práctica:** si dudas, en un proyecto pequeño empieza con A; si el proyecto tiene fecha de vida larga y crecerá en features, empieza directo con B (migrar de A a B más tarde es costoso).

### Equivalencia conceptual entre A y B

Ambas directrices implementan **las mismas capas y el mismo flujo de dependencias**; solo cambian los nombres y la ubicación de las carpetas:

| Concepto                                                   | Directriz A (Layer-first)          | Directriz B (Feature-first)                          |
| ---------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------- |
| Modelos, interfaces, contratos del dominio                 | `core/models/`, `core/interfaces/` | `modules/<feature>/domain/`                          |
| Casos de uso                                               | `core/usecases/`                   | `modules/<feature>/application/`                     |
| Puerto del repositorio (abstracto)                         | `core/repositories/`               | `modules/<feature>/domain/repositories/`             |
| Repositorio concreto (fuente de datos)                     | `data/repositories/`               | `modules/<feature>/infrastructure/http/`             |
| Mappers                                                    | `data/utils/`                      | `modules/<feature>/infrastructure/mappers/`          |
| Preocupaciones transversales (auth, guards, interceptores) | `infrastructure/`                  | `core/` (global)                                     |
| Componentes, páginas, layouts                              | `presentation/`                    | `modules/<feature>/presentation/` + `shared/layout/` |
| Elementos compartidos entre features                       | `shared/`                          | `shared/` (igual)                                    |
| Estado reactivo y fachadas                                 | `presentation/store/`              | `modules/<feature>/application/` (facade + state)    |

---

## Detalle de scaffolding

### Directriz A — Layer-first

La estructura general de carpetas recomendada:

```
src/
│
├── core/
│
├── data/
│
├── infrastructure/
│
├── presentation/
│
└── shared/
```

#### Core

Este directorio alberga la lógica central y las definiciones fundamentales que son críticas para la aplicación. Contiene los **casos de uso, modelos de dominio, interfaces y contratos** que definen cómo se estructuran y manipulan los datos en el núcleo de la aplicación.

La carpeta core debe ser lo más independiente posible, evitando dependencias directas con otros módulos como _infrastructure_ o _presentation_. Esto asegura que la lógica de negocio permanece inmutable frente a cambios en la interfaz de usuario o en la infraestructura técnica. Los desarrolladores deben centrarse en mantener esta capa libre de cualquier código específico de framework, lo que facilita su reutilización y adaptabilidad.

```
src/
│
├── core/
│   ├── base/
│   ├── enums/
│   ├── interfaces/
│   ├── models/
│   ├── repositories/
│   └── usecases/
```

#### Data

Aquí se implementan los repositorios y cualquier lógica relacionada con la **persistencia de datos**. Esta carpeta se encarga de la **interacción con fuentes de datos externas**, como bases de datos, APIs, o servicios externos, y transforma los datos en objetos manejables por el dominio.

Es crucial que la capa de data actúe como un puente entre la lógica de negocio (_core_) y las tecnologías subyacentes. La implementación de repositorios debe abstraer detalles específicos de la infraestructura, permitiendo así que la lógica de negocio no dependa de la implementación concreta de persistencia. Esta abstracción también facilita la realización de pruebas unitarias al permitir la inyección de repositorios simulados.

```
src/
│
├── data/
│   ├── repositories/
│   └── utils/
```

#### Infrastructure

Este módulo se encarga de gestionar las preocupaciones transversales y los servicios generales que son necesarios en toda la aplicación, como la **autenticación, autorización, interceptores de HTTP, y manejo de errores globales**.

La _infrastructure_ debe ser lo más delgada posible y enfocada en proporcionar servicios de soporte que puedan ser reutilizados en otras capas de la aplicación. El diseño de esta capa debe facilitar la integración y extensión de servicios transversales, asegurando que los cambios en la infraestructura no afecten directamente la lógica de negocio o de presentación.

```
src/
│
├── infrastructure/
│   ├── auth/
│   ├── guards/
│   ├── insights/
│   └── interceptors/
```

#### Presentation

Esta carpeta concentra todos los elementos relacionados con la interacción del usuario y la interfaz gráfica, incluyendo **componentes, vistas, layouts, y servicios** que manipulan el estado de la UI. Se encarga de la comunicación entre la lógica de negocio y el usuario final.

La estructura de _presentation_ debe permitir una clara separación entre la lógica de presentación y la lógica de negocio. Es recomendable que los componentes sean lo más simples posible, delegando la lógica compleja a servicios especializados. De esta manera, se facilita la mantenibilidad y la prueba de los componentes individuales, al tiempo que se promueve la reutilización de la lógica compartida.

```
src/
│
├── presentation/
│   ├── components/
│   ├── interfaces/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   └── store/
```

#### Shared

Este directorio contiene elementos que son compartidos a lo largo de toda la aplicación, como **componentes reutilizables, pipes, directivas, y servicios utilitarios**.

El contenido de _shared_ debe estar cuidadosamente curado para evitar un acoplamiento innecesario entre diferentes módulos de la aplicación. Solo los elementos que tienen un uso transversal y no dependen de contextos específicos deben ser incluidos aquí. Este enfoque hace que los módulos permanezcan modulares y que el código sea más fácil de gestionar y escalar.

```
src/
│
├── shared/
│   ├── components/
│   ├── directives/
│   ├── mocks/
│   ├── pipes/
│   ├── services/
│   └── utils/
```

---

### Directriz B — Feature-first

La estructura general de carpetas recomendada:

```
src/
│
├── core/
│
├── shared/
│
└── modules/
    └── <feature>/
```

Cada feature es una **unidad vertical completa**: agrupa sus cuatro capas bajo un mismo directorio, de modo que trabajar en una feature no obliga a navegar por carpetas globales de capa. Las dependencias siempre apuntan hacia adentro: `presentation` → `application` → `domain`; `infrastructure` implementa los puertos definidos en `domain`.

#### Estructura de una feature

```
modules/
│
└── <feature>/
    │
    ├── domain/
    │   ├── models/
    │   │   └── user.model.ts
    │   └── repositories/
    │       └── user.repository.ts          (puerto abstracto)
    │
    ├── application/
    │   ├── use-cases/
    │   │   ├── get-user-by-id.usecase.ts
    │   │   └── create-user.usecase.ts
    │   └── user.facade.ts                  (fachada: expone use-cases + señales)
    │
    ├── infrastructure/
    │   ├── http/
    │   │   └── user-http.repository.ts     (adaptador: implementa el puerto)
    │   └── mappers/
    │       └── user.mapper.ts              (opcional: si el DTO no calza con el modelo)
    │
    ├── presentation/
    │   ├── pages/
    │   │   └── user-detail/
    │   │       ├── user-detail.ts
    │   │       └── user-detail.html
    │   └── user.routes.ts                  (rutas lazy de la feature)
    │
    └── feature.providers.ts                (registro DI: puerto → adaptador)
```

#### Domain

La capa más interna e independiente. Contiene los **modelos del dominio** (interfaces o clases de negocio), las **interfaces de los repositorios** (los "puertos" por donde el negocio accede a los datos) y cualquier contrato o enum de dominio. **No importa Angular, HttpClient ni ningún framework** — solo, como mucho, tipos de RxJS (`Observable`).

Reemplaza a `core/models` + `core/interfaces` + `core/repositories` de la Directriz A.

```
modules/<feature>/domain/
│
├── models/
└── repositories/        (abstract class / interface — el puerto)
```

#### Application

Contiene la **lógica de aplicación**: los casos de uso que orquestan operaciones (encadenar llamadas al repositorio, validar reglas, escribir en stores) y la **fachada (facade)** que expone una API simple a la presentación. La facade no contiene lógica de negocio: delega en los use-cases y **reexpone los signals de estado** para que los componentes lean con `()` y se actualicen reactivamente.

Reemplaza a `core/usecases` de la Directriz A y absorbe `presentation/store` (el estado reactivo de la feature vive con su lógica, no con su UI).

```
modules/<feature>/application/
│
├── use-cases/
└── facade
```

#### Infrastructure

Implementa los puertos definidos en `domain`. El adaptador HTTP (repositorio concreto con `HttpClient`), los mappers entre DTOs de la API y modelos del dominio, y cualquier integración con servicios externos.

Reemplaza a `data/repositories` + `data/utils` de la Directriz A. **Ojo:** las preocupaciones transversales (auth, interceptores de HTTP, guards globales) **no** viven aquí: en la Directriz B se mueven a la carpeta global `core/`.

```
modules/<feature>/infrastructure/
│
├── http/
└── mappers/             (opcional)
```

#### Presentation

Páginas, componentes y rutas lazy de la feature. Los componentes permanecen simples: inyectan la facade, invocan sus métodos y leen sus señales; no hablan directamente con `HttpClient` ni con los repositorios.

Reemplaza a `presentation/pages` + `presentation/components` de la Directriz A; los layouts compartidos (topbar, sidebar, shell) van a `shared/layout/`.

```
modules/<feature>/presentation/
│
├── pages/
└── <feature>.routes.ts
```

#### Core (global)

En la Directriz B, `core/` **no** contiene lógica de negocio (esa vive dentro de cada feature). Contiene únicamente **preocupaciones transversales** compartidas por todas las features: interceptores HTTP, guards, servicios globales (auth, tema, layout), stores de sesión y el registro de providers raíz. Es la misma responsabilidad que la carpeta `infrastructure/` de la Directriz A.

```
src/core/
│
├── auth/
├── guards/
├── http/           (interceptores)
├── providers/      (registro de providers globales)
└── services/
```

#### Shared

Igual que en la Directriz A: componentes, pipes, directivas y utilidades compartidas, sin lógica de negocio. En la Directriz B también residen los **layouts** del shell (topbar, sidebar, footer) porque pertenecen a la aplicación completa, no a una feature.

```
src/shared/
│
├── components/
├── directives/
├── layout/
├── pipes/
├── services/
└── utils/
```

---

## Ejemplos de código

Ejemplos de código siguiendo las mejores prácticas de Clean Architecture en un proyecto front-end desarrollado con TypeScript y Angular 20+. Los ejemplos se muestran **por directriz**; los conceptos son idénticos, cambian la ubicación y algunos detalles de estilo.

### Model

El modelo _User_ representa una entidad del dominio con propiedades como id, name, email y role. En la Directriz A puede ser una clase con comportamiento; en la Directriz B se prefiere una interfaz pura (los modelos de dominio front-end son casi siempre datos inmutables; el comportamiento vive en los casos de uso).

**Directriz A (clase con comportamiento):**

```typescript
// core/models/User.ts
import { UserRole } from '../enums/UserRole';

export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public role: UserRole,
  ) {}

  // Método para cambiar el rol del usuario
  changeRole(newRole: UserRole): void {
    this.role = newRole;
  }
}
```

**Directriz B (interface de datos):**

```typescript
// modules/users/domain/models/user.model.ts
import { UserRole } from '../enums/user-role.enum';

export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
}
```

### Interface

La interfaz _UserRole_ define la estructura básica de un rol, asegurando que todos los roles en la aplicación sigan un formato consistente.

```typescript
// core/interfaces/UserRole.ts   (Directriz A)
// modules/users/domain/interfaces/user-role.interface.ts   (Directriz B)

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}
```

### Enum

Enum podría ser utilizado en un modelo de orden para establecer y verificar el estado de una orden, lo que asegura que solo se asignen valores válidos y predefinidos al estado de una orden.

```typescript
// core/enums/OrderStatus.ts   (Directriz A)
// modules/orders/domain/enums/order-status.enum.ts   (Directriz B)

export enum OrderStatus {
  PENDING = 'PENDING', // Orden creada, pero no procesada
  PROCESSING = 'PROCESSING', // Orden en proceso
  SHIPPED = 'SHIPPED', // Orden enviada
  DELIVERED = 'DELIVERED', // Orden entregada
  CANCELED = 'CANCELED', // Orden cancelada
  RETURNED = 'RETURNED', // Orden devuelta
}
```

### Mapper

El mapper se utiliza para transformar datos, por ejemplo, al convertir un objeto de un formato que viene de una API a un objeto de dominio. Es **opcional**: solo se crea cuando la respuesta del backend no coincide con el modelo de dominio. Si el contrato de la API ya calza con el modelo, el repositorio puede tipar la respuesta directamente y no se necesita mapper.

```typescript
// data/utils/UserMapper.ts   (Directriz A)
// modules/users/infrastructure/mappers/user.mapper.ts   (Directriz B)

import { User } from '../../domain/models/user.model';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
}

export class UserMapper {
  static toDomain(raw: UserDto): User {
    return { id: raw.id, name: raw.name, email: raw.email, role: raw.role as UserRole };
  }

  static toDTO(user: User): UserDto {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
```

### Repository (puerto abstracto)

El puerto define **qué** operaciones de datos necesita el negocio, sin conocer **cómo** se implementan. Es la pieza que permite la Inversión de Dependencias: el dominio declara el contrato y la infraestructura lo implementa.

**Directriz A (interfaz en `core/repositories`):**

```typescript
// core/interfaces/UserRepository.ts
import { User } from '../models/User';

export interface UserRepository {
  getUserById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  createUser(user: User): Promise<void>;
  updateUser(user: User): Promise<void>;
  deleteUser(id: string): Promise<void>;
}
```

**Directriz B (clase abstracta en `modules/users/domain/repositories`, con `Observable`):**

```typescript
// modules/users/domain/repositories/user.repository.ts
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export abstract class UserRepository {
  abstract getUserById(id: string): Observable<User | null>;
  abstract getAllUsers(): Observable<User[]>;
  abstract createUser(user: User): Observable<User>;
  abstract deleteUser(id: string): Observable<void>;
}
```

### Repository (implementación concreta)

El repositorio concreto implementa el puerto y es el único lugar que conoce la fuente de datos (API HTTP, storage, mock en memoria).

**Directriz A (`data/repositories`):**

```typescript
// data/repositories/UserRepositoryImpl.ts
import { UserRepository } from '../../core/interfaces/UserRepository';
import { User } from '../../core/models/User';

export class UserRepositoryImpl implements UserRepository {
  private users: User[] = []; // Simulación de almacenamiento en memoria

  async getUserById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async createUser(user: User): Promise<void> {
    this.users.push(user);
  }

  async updateUser(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
  }

  async deleteUser(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
```

**Directriz B (`modules/users/infrastructure/http`, con `HttpClient` e `inject()`):**

```typescript
// modules/users/infrastructure/http/user-http.repository.ts
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/models/user.model';

export class UserHttpRepository extends UserRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/users`;

  override getUserById(id: string): Observable<User | null> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  override getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  override createUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  override deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

### UseCase

El caso de uso encapsula una operación específica de la lógica de negocio. Encapsularlo permite reutilizarlo, testearlo aisladamente y cambiar su implementación sin tocar la presentación.

**Directriz A (constructor DI, `Promise`):**

```typescript
// core/usecases/GetUserByIdUseCase.ts
import { UserRepository } from '../interfaces/UserRepository';
import { User } from '../models/User';

export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<User | null> {
    return this.userRepository.getUserById(id);
  }
}
```

**Directriz B (`inject()`, `Observable`):**

```typescript
// modules/users/application/use-cases/get-user-by-id.usecase.ts
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/models/user.model';

export class GetUserByIdUseCase {
  private readonly userRepo = inject(UserRepository);

  execute(id: string): Observable<User | null> {
    return this.userRepo.getUserById(id);
  }
}
```

**Directriz B con orquestación (varias llamadas + escritura de estado):**

Cuando un caso de uso encadena pasos (guardar en servidor y luego refrescar el estado local), ahí es donde su valor es mayor que un simple passthrough:

```typescript
// modules/users/application/use-cases/create-user.usecase.ts
import { inject } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserState } from '../user.state';

export class CreateUserUsecase {
  private readonly userRepo = inject(UserRepository);
  private readonly userState = inject(UserState);

  execute(user: User): Observable<User> {
    return this.userRepo.createUser(user).pipe(
      // Si el backend no devuelve el usuario creado, recarga la lista
      switchMap((created) =>
        created
          ? this.userRepo.getAllUsers().pipe(
              tap((users) => this.userState.setUsers(users)),
              () => created,
            )
          : [user],
      ),
    );
  }
}
```

> **Regla de uso:** si el caso de uso solo hace _una_ llamada al repositorio sin reglas ni orquestación, puede omitirse y exponer el método directamente desde la facade. No se crean use-cases ceremoniales (KISS).

### Facade

La fachada es la **única puerta de entrada** que consume la presentación. No contiene lógica de negocio: delega en los casos de uso y **reexpone los signals de estado** para que los componentes se actualicen de forma reactiva.

```typescript
// modules/users/application/user.facade.ts
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GetUserByIdUseCase } from './use-cases/get-user-by-id.usecase';
import { CreateUserUsecase } from './use-cases/create-user.usecase';
import { UserState } from './user.state';
import { User } from '../domain/models/user.model';

export class UserFacade {
  private readonly getUserById = inject(GetUserByIdUseCase);
  private readonly createUser = inject(CreateUserUsecase);
  private readonly userState = inject(UserState);

  // Señales reexpuestas (alias): los componentes las leen con ()
  readonly users = this.userState.users;
  readonly loading = this.userState.loading;

  getById(id: string): Observable<User | null> {
    return this.getUserById.execute(id);
  }

  create(user: User): Observable<User> {
    return this.createUser.execute(user);
  }
}
```

### Store (estado reactivo con signals)

El estado de una feature se guarda en un store con **signals** de Angular. Los casos de uso **escriben** (vía `set`/`update`); los componentes **leen** en el template con `()` y Angular lo detecta automáticamente (incluido en modo zoneless).

```typescript
// modules/users/application/user.state.ts
import { Injectable, signal, computed } from '@angular/core';
import { User } from '../domain/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserState {
  private readonly _users = signal<User[]>([]);
  private readonly _loading = signal(false);

  // Solo lectura para el exterior — la escritura ocurre únicamente desde los use-cases
  readonly users = this._users.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly count = computed(() => this._users().length);

  setUsers(users: User[]): void {
    this._users.set(users);
  }

  setLoading(value: boolean): void {
    this._loading.set(value);
  }
}
```

### Registro de providers (Directriz B)

En Angular, el enlace _puerto → adaptador_ se declara con DI; en la Directriz B, cada feature exporta su propio registro para poder componerlo en la configuración raíz (globales) o a nivel de ruta (lazy):

```typescript
// modules/users/feature.providers.ts
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { UserRepository } from './domain/repositories/user.repository';
import { UserHttpRepository } from './infrastructure/http/user-http.repository';

export function provideUsersFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: UserRepository, useClass: UserHttpRepository }, // puerto → adaptador
    GetUserByIdUseCase,
    CreateUserUsecase,
    UserState,
    UserFacade,
  ]);
}
```

Y en la configuración de la aplicación:

```typescript
// app.config.ts (o a nivel de ruta lazy en app.routes.ts)
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideUsersFeature(),
  ],
};
```

**Directriz A** logra lo mismo con un proveedor global único que agrupa todos los registros de repositorios y casos de uso.

### Uso desde un componente

Independientemente de la directriz, el componente permanece simple: inyecta la facade, invoca métodos y lee señales.

```typescript
// modules/users/presentation/pages/user-detail/user-detail.ts
import { Component, inject, input, OnInit } from '@angular/core';
import { UserFacade } from '../../../application/user.facade';

@Component({
  selector: 'app-user-detail',
  template: `
    @if (facade.loading()) {
      <p>Cargando…</p>
    } @else if (user(); as u) {
      <h1>{{ u.name }}</h1>
      <p>{{ u.email }}</p>
    }
  `,
})
export class UserDetail implements OnInit {
  protected readonly facade = inject(UserFacade);
  protected readonly id = input.required<string>();

  protected readonly user = this.facade.selectedUser;

  ngOnInit(): void {
    this.facade.getById(this.id()).subscribe();
  }
}
```

---

## Estado reactivo con signals

En Angular 20+ el estado se maneja con **signals** en lugar de `BehaviorSubject` o servicios con Observables. Reglas del estándar:

1. **Los stores** (clases con `signal()`) son la fuente de verdad del estado. Exponen siempre señales con `asReadonly()`; la escritura ocurre únicamente desde casos de uso, nunca desde componentes.
2. **`Observable` solo para el viaje de ida** — es decir, para las llamadas HTTP. El resultado se aplica al store dentro de `tap`/`switchMap`, y de ahí la reactividad fluye por signals hasta el template.
3. **Los componentes no se suscriben** al estado: lo leen como funciones en el template (`@if (facade.loading())`) o pasan la señal a `computed()`.
4. **Los efectos** (`effect()`) se reservan para sincronización con el mundo exterior (DOM, localStorage, APIs de terceros); no se usan como sustituto de `computed()`.

```typescript
// Patrón: HTTP (Observable) → store (signal) → template (lectura con ())
facade.loadUsers().subscribe(); // viaje de ida: Observable
//       └─ tap(users => state.setUsers(users))
//              └─ this._users.set(users)   ← escritura en el store
//                     └─ template: @for (u of facade.users())   ← lectura reactiva
```

Esto elimina la necesidad de `async pipe` para el estado local y simplifica el manejo de errores y loading en la presentación.

---

## Conclusión

Implementar **Clean Architecture** en el desarrollo front-end proporciona una estructura robusta y escalable, permitiendo a los equipos de desarrollo crear aplicaciones que son fáciles de mantener y escalar a lo largo del tiempo. Este documento debe ser utilizado como guía para asegurar una implementación coherente y eficiente, adaptable a diversas tecnologías y frameworks.

Los principios (separación de responsabilidades, dependencias hacia adentro, SOLID, DRY, KISS) son innegociables y aplican a todos los proyectos. La **directriz estructural** —layer-first (A) o feature-first (B)— se elige al inicio del proyecto según su tamaño, expectativa de crecimiento y número de desarrolladores, y queda documentada en el repositorio como decisión de arquitectura vigente para todo el equipo.
